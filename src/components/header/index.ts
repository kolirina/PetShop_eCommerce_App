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
import cart from '../../assets/cart.png';
import styles from './header.module.css';

export default class Header {
  private container: HTMLElement;

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
    this.burgerMenu = createDiv(styles.burgerMenu, this.container);
    this.updateHeader();

    const mobileButtons = createDiv(styles.mobileButtons, this.container);
    const basketButton = createImg(
      styles.basketButton,
      cart,
      'basket',
      mobileButtons
    );
    basketButton.addEventListener('click', () =>
      this.router.navigateTo(Pages.BASKET)
    );
    const burgerButton = createBtn(styles.burgerButton, '', mobileButtons);
    createSpan(styles.burgerIcon, '', burgerButton);
    burgerButton.addEventListener('click', () => {
      this.burgerMenu.classList.toggle(styles.burgerMenuOpen);
      document.body.classList.toggle(styles.noscroll);
    });
  }

  updateHeader() {
    this.userControls.innerHTML = '';
    const basketButton = createImg(
      styles.basketButton,
      cart,
      'basket',
      this.userControls
    );
    basketButton.addEventListener('click', () =>
      this.router.navigateTo(Pages.BASKET)
    );
    const catalogButton = createBtn(
      styles.button,
      'Catalog',
      this.userControls
    );
    catalogButton.addEventListener('click', () =>
      this.router.navigateTo(Pages.CATALOG)
    );
    const aboutButton = createBtn(styles.button, 'About Us', this.userControls);
    aboutButton.addEventListener('click', () =>
      this.router.navigateTo(Pages.ABOUT_US)
    );
    if (isLoggedIn()) {
      const profileButton = createBtn(
        styles.button,
        'Profile',
        this.userControls
      );
      profileButton.addEventListener('click', () =>
        this.router.navigateTo(Pages.PROFILE)
      );
      const logoutButton = createBtn(
        styles.button,
        'Logout',
        this.userControls
      );
      logoutButton.addEventListener('click', () => {
        localStorage.clear();
        this.updateHeader();
        this.router.navigateTo(Pages.MAIN);
      });
    } else {
      const loginButton = createBtn(styles.button, 'Login', this.userControls);
      loginButton.addEventListener('click', () =>
        this.router.navigateTo(Pages.LOGIN)
      );
      const registerButton = createBtn(
        styles.button,
        'Register',
        this.userControls
      );
      registerButton.addEventListener('click', () =>
        this.router.navigateTo(Pages.REGISTRATION)
      );
    }

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
    });
    return item;
  }

  getHeaderElement() {
    return this.container;
  }
}
