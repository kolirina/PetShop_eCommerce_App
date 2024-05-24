import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import Router from '../../router';
import Pages from '../../router/pageNames';
import MainPage from './index';
import styles from './mainPage.module.css';

describe('MainPage', () => {
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
    router.navigateTo = vi.fn();
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('should render the MainPage with correct elements', () => {
    const mainPage = new MainPage(router, container);

    expect(mainPage.container.classList.contains(styles.container)).toBe(true);

    const loginLink = mainPage.container.querySelector(
      `.${styles.link}:nth-child(1)`
    );
    expect(loginLink).not.toBeNull();
    expect(loginLink!.textContent).toBe('Login');

    const registerLink = mainPage.container.querySelector(
      `.${styles.link}:nth-child(2)`
    );
    expect(registerLink).not.toBeNull();
    expect(registerLink!.textContent).toBe('Register');

    const homeLink = mainPage.container.querySelector(
      `.${styles.link}:nth-child(3)`
    );
    expect(homeLink).not.toBeNull();
    expect(homeLink!.textContent).toBe('Home');
  });

  it('should navigate to the login page when the "Login" link is clicked', () => {
    const navigateToSpy = vi.spyOn(router, 'navigateTo');
    const mainPage = new MainPage(router, container);

    const loginLink = mainPage.container.querySelector(
      `.${styles.link}:nth-child(1)`
    ) as HTMLElement;
    loginLink.click();

    expect(navigateToSpy).toHaveBeenCalledWith(Pages.LOGIN);
  });

  it('should navigate to the registration page when the "Register" link is clicked', () => {
    const navigateToSpy = vi.spyOn(router, 'navigateTo');
    const mainPage = new MainPage(router, container);

    const registerLink = mainPage.container.querySelector(
      `.${styles.link}:nth-child(2)`
    ) as HTMLElement;
    registerLink.click();

    expect(navigateToSpy).toHaveBeenCalledWith(Pages.REGISTRATION);
  });

  it('should navigate to the main page when the "Home" link is clicked', () => {
    const navigateToSpy = vi.spyOn(router, 'navigateTo');
    const mainPage = new MainPage(router, container);

    const homeLink = mainPage.container.querySelector(
      `.${styles.link}:nth-child(3)`
    ) as HTMLElement;
    homeLink.click();

    expect(navigateToSpy).toHaveBeenCalledWith(Pages.MAIN);
  });
});
