import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import Router from '../../router';
import Pages from '../../router/pageNames';
import Header from './index';
import styles from './header.module.css';
import isLoggedIn from '../../utils/checkFunctions';
import { getCartById } from '../../api/SDK';
import { LineItem } from '../../types/cart';

vi.mock('../../utils/checkFunctions', () => ({
  default: vi.fn(),
}));

vi.mock('../../api/SDK', () => ({
  getCartById: vi.fn(),
}));

describe('Header', () => {
  let dom: JSDOM;
  let router: Router;
  let container: HTMLElement;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
      url: 'http://localhost',
    });
    global.document = dom.window.document;
    global.window = dom.window as unknown as Window & typeof globalThis;
    global.localStorage = dom.window.localStorage;

    router = new Router();
    router.navigateTo = vi.fn(); // Mock navigateTo method

    container = document.createElement('div');
    document.body.appendChild(container);

    // Reset mock implementation before each test
    vi.mocked(isLoggedIn).mockReset();
    vi.mocked(getCartById).mockReset();
  });

  it('should render the Header with correct elements', () => {
    const header = new Header(router);
    container.appendChild(header.getHeaderElement());

    const logoContainer = header
      .getHeaderElement()
      .querySelector(`.${styles.logoContainer}`);
    expect(logoContainer).not.toBeNull();
    const logoImage = logoContainer!.querySelector('img');
    expect(logoImage).not.toBeNull();

    const userControls = header
      .getHeaderElement()
      .querySelector(`.${styles.userControls}`);
    expect(userControls).not.toBeNull();

    const burgerMenu = header
      .getHeaderElement()
      .querySelector(`.${styles.burgerMenu}`);
    expect(burgerMenu).not.toBeNull();

    const burgerButton = header
      .getHeaderElement()
      .querySelector(`.${styles.burgerButton}`);
    expect(burgerButton).not.toBeNull();
  });

  it('should navigate to the main page when the logo is clicked', () => {
    const header = new Header(router);
    container.appendChild(header.getHeaderElement());

    const logoImage = header
      .getHeaderElement()
      .querySelector(`.${styles.logoContainer} img`) as HTMLElement;
    logoImage.click();

    expect(router.navigateTo).toHaveBeenCalledWith(Pages.MAIN);
  });

  it('should update the header and show Logout button when user is logged in', () => {
    vi.mocked(isLoggedIn).mockReturnValue(true);

    const header = new Header(router);
    container.appendChild(header.getHeaderElement());

    header.updateHeader();

    const profileButton = header
      .getHeaderElement()
      .querySelector(`.${styles.userControls} .${styles.button}:nth-child(3)`);
    expect(profileButton).not.toBeNull();
    expect(profileButton!.textContent).toBe('Profile');

    const logoutButton = header
      .getHeaderElement()
      .querySelector(`.${styles.userControls} .${styles.button}:nth-child(4)`);
    expect(logoutButton).not.toBeNull();
    expect(logoutButton!.textContent).toBe('Logout');
  });

  it('should navigate to login page when Login button is clicked', () => {
    vi.mocked(isLoggedIn).mockReturnValue(false);

    const header = new Header(router);
    container.appendChild(header.getHeaderElement());

    header.updateHeader();

    const loginButton = header
      .getHeaderElement()
      .querySelector(
        `.${styles.userControls} .${styles.button}:nth-child(3)`
      ) as HTMLElement;
    loginButton.click();

    expect(router.navigateTo).toHaveBeenCalledWith(Pages.LOGIN);
  });

  it('should navigate to registration page when Register button is clicked', () => {
    vi.mocked(isLoggedIn).mockReturnValue(false);

    const header = new Header(router);
    container.appendChild(header.getHeaderElement());

    header.updateHeader();

    const registerButton = header
      .getHeaderElement()
      .querySelector(
        `.${styles.userControls} .${styles.button}:nth-child(4)`
      ) as HTMLElement;
    registerButton.click();

    expect(router.navigateTo).toHaveBeenCalledWith(Pages.REGISTRATION);
  });

  it('should log out the user and update the header when Logout button is clicked', () => {
    vi.mocked(isLoggedIn).mockReturnValue(true);
    localStorage.setItem('id', '123');
    localStorage.setItem('token', 'abc');

    const header = new Header(router);
    container.appendChild(header.getHeaderElement());

    header.updateHeader();

    const logoutButton = header
      .getHeaderElement()
      .querySelector(
        `.${styles.userControls} .${styles.button}:nth-child(4)`
      ) as HTMLElement;
    logoutButton.click();

    expect(localStorage.getItem('id')).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(router.navigateTo).toHaveBeenCalledWith(Pages.MAIN);
  });

  it('should toggle burger menu visibility when burger button is clicked', () => {
    const header = new Header(router);
    container.appendChild(header.getHeaderElement());

    const burgerButton = header
      .getHeaderElement()
      .querySelector(`.${styles.burgerButton}`) as HTMLElement;
    burgerButton.click();

    const burgerMenu = header
      .getHeaderElement()
      .querySelector(`.${styles.burgerMenu}`);
    expect(burgerMenu!.classList.contains(styles.burgerMenuOpen)).toBe(true);

    burgerButton.click();
    expect(burgerMenu!.classList.contains(styles.burgerMenuOpen)).toBe(false);
  });

  it('should display the correct cart count when items are present', async () => {
    const mockCart = {
      body: {
        lineItems: [{ quantity: 2 }, { quantity: 3 }] as LineItem[],
      },
    };

    vi.mocked(getCartById).mockResolvedValue(mockCart);
    localStorage.setItem('registered_user_cart_id', 'cart123');

    const header = new Header(router);
    container.appendChild(header.getHeaderElement());

    await header.updateHeader();

    const cartCountElement = header
      .getHeaderElement()
      .querySelector(`.${styles.cartCount}`);
    expect(cartCountElement).not.toBeNull();
    expect(cartCountElement!.textContent).toBe('5');
  });

  it('should not display the cart count when there are no items in the cart', async () => {
    const mockCart = {
      body: {
        lineItems: [],
      },
    };

    vi.mocked(getCartById).mockResolvedValue(mockCart);
    localStorage.setItem('registered_user_cart_id', 'cart123');

    const header = new Header(router);
    container.appendChild(header.getHeaderElement());

    await header.updateHeader();

    const cartCountElement = header
      .getHeaderElement()
      .querySelector(`.${styles.cartCount}`);
    expect(cartCountElement).toBeNull();
  });
});
