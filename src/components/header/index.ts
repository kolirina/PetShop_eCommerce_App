import Router from '../../router';
import Pages from '../../router/pageNames';
import {
  createBtn,
  createDiv,
  createImg,
  createParagraph,
  createSpan,
} from '../../utils/elementCreator';
import isLoggedIn from '../../utils/checkFunctions';
import logo from '../../assets/logo.png';
import cartImage from '../../assets/cart.png';
import styles from './header.module.css';
import { getCartById } from '../../api/SDK';
import { LineItem } from '../../types/cart';

export default class Header {
  private container: HTMLElement;

  private burgerButton: HTMLButtonElement;

  private burgerMenu: HTMLElement;

  private userControls: HTMLElement;

  private router: Router;

  constructor(router: Router) {
    this.router = router;
    this.container = document.createElement('header');
    this.container.classList.add(styles.header);

    const logoContainer = createDiv(styles.logoContainer, this.container);
    const logoImage = document.createElement('img');
    logoImage.src = logo;
    logoImage.addEventListener('click', () => router.navigateTo(Pages.MAIN));
    logoContainer.append(logoImage);

    this.userControls = createDiv(styles.userControls, this.container);
    this.burgerButton = createBtn(styles.burgerButton, '');
    createSpan(styles.burgerIcon, '', this.burgerButton);
    this.burgerButton.addEventListener('click', () => {
      this.burgerMenu.classList.toggle(styles.burgerMenuOpen);
      document.body.classList.toggle(styles.noscroll);
      this.burgerButton.classList.toggle(styles.burgerActive);
    });
    this.burgerMenu = createDiv(styles.burgerMenu, this.container);
    this.updateHeader();
  }

  async updateHeader() {
    this.userControls.innerHTML = '';
    const cartId =
      localStorage.getItem('registered_user_cart_id') ||
      localStorage.getItem('anonymous_cart_id');
    if (cartId) {
      const cart = await getCartById(cartId);
      const totalCount = cart.body.lineItems.reduce(
        (total: number, item: LineItem) => total + item.quantity,
        0
      );
      if (totalCount > 0) {
        const countElement = createParagraph(
          styles.cartCount,
          totalCount,
          this.userControls
        );
        countElement.addEventListener('click', () =>
          this.router.navigateTo(Pages.BASKET)
        );
      }
    }
    const basketButton = createImg(
      styles.basketButton,
      cartImage,
      'basket',
      this.userControls
    );
    basketButton.addEventListener('click', () =>
      this.router.navigateTo(Pages.BASKET)
    );

    const links = createDiv(styles.links, this.userControls);
    const catalogButton = createBtn(styles.button, 'Catalog', links);
    catalogButton.addEventListener('click', () =>
      this.router.navigateTo(Pages.CATALOG)
    );
    const aboutButton = createBtn(styles.button, 'About Us', links);
    aboutButton.addEventListener('click', () =>
      this.router.navigateTo(Pages.ABOUT_US)
    );
    if (isLoggedIn()) {
      const profileButton = createBtn(styles.button, 'Profile', links);
      profileButton.addEventListener('click', () =>
        this.router.navigateTo(Pages.PROFILE)
      );
      const logoutButton = createBtn(styles.button, 'Logout', links);
      logoutButton.addEventListener('click', () => {
        localStorage.clear();
        this.updateHeader();
        this.router.navigateTo(Pages.MAIN);
      });
    } else {
      const loginButton = createBtn(styles.button, 'Login', links);
      loginButton.addEventListener('click', () =>
        this.router.navigateTo(Pages.LOGIN)
      );
      const registerButton = createBtn(styles.button, 'Register', links);
      registerButton.addEventListener('click', () =>
        this.router.navigateTo(Pages.REGISTRATION)
      );
    }
    this.userControls.append(this.burgerButton);

    this.burgerMenu.innerHTML = '';

    this.addMenuItem('Home', () => this.router.navigateTo(Pages.MAIN));
    this.addMenuItem('Catalog', () => this.router.navigateTo(Pages.CATALOG));
    this.addMenuItem('About Us', () => this.router.navigateTo(Pages.ABOUT_US));
    if (isLoggedIn()) {
      this.addMenuItem('Profile', () => this.router.navigateTo(Pages.PROFILE));
      this.addMenuItem('Logout', () => {
        localStorage.removeItem('id');
        localStorage.removeItem('token');
        this.updateHeader();
        this.router.navigateTo(Pages.MAIN);
      });
    } else {
      this.addMenuItem('Login', () => this.router.navigateTo(Pages.LOGIN));
      this.addMenuItem('Register', () =>
        this.router.navigateTo(Pages.REGISTRATION)
      );
    }
  }

  private addMenuItem(text: string, onClick: () => void): HTMLDivElement {
    const item = createParagraph(styles.menuItem, text, this.burgerMenu);
    item.className = styles.menuItem;
    item.textContent = text;
    item.addEventListener('click', onClick);
    item.addEventListener('click', () => {
      this.burgerMenu.classList.toggle(styles.burgerMenuOpen);
      document.body.classList.toggle(styles.noscroll);
      this.burgerButton.classList.toggle(styles.burgerActive);
    });
    return item;
  }

  getHeaderElement() {
    return this.container;
  }
}
