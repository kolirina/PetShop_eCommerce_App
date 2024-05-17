import Router from '../../router';
import Pages from '../../router/pageNames';
import { createBtn, createDiv, createSpan } from '../../utils/elementCreator';
import styles from './header.module.css';
import logo from '../../assets/logo.png';

export default class Header {
  private container: HTMLElement;

  constructor(router: Router) {
    this.container = document.createElement('header');
    this.container.classList.add(styles.header);

    const logoContainer = createDiv(styles.logoContainer, this.container);
    const logoImage = document.createElement('img');
    logoImage.src = logo;
    logoImage.addEventListener('click', () => router.navigateTo(Pages.MAIN));
    logoContainer.append(logoImage);

    const links = createDiv(styles.linksContainer, this.container);
    const homeLink = createSpan(styles.link, 'Home', links);
    homeLink.addEventListener('click', () => router.navigateTo(Pages.MAIN));

    const userControls = createDiv(styles.userControls, this.container);
    const loginButton = createBtn(styles.button, 'Login', userControls);
    loginButton.addEventListener('click', () => {
      router.navigateTo(Pages.LOGIN);
    });

    const registerButton = createBtn(styles.button, 'Register', userControls);
    registerButton.addEventListener('click', () => {
      router.navigateTo(Pages.REGISTRATION);
    });
  }

  getHeaderElement() {
    return this.container;
  }
}
