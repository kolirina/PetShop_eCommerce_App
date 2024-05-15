import Router from '../../router';
import Pages from '../../router/pageNames';
import { createBtn, createDiv, createSpan } from '../../utils/elementCreator';
import './header.css';

export default class Header {
  private container: HTMLElement;

  constructor(router: Router) {
    this.container = document.createElement('header');
    this.container.classList.add('header');

    const logo = createDiv('logo-container', this.container);
    logo.textContent = 'Pet Store';

    const homeLink = createSpan('home-link', 'Home', this.container);
    homeLink.addEventListener('click', () => router.navigateTo(Pages.MAIN));

    const userControls = createDiv('user-controls', this.container);
    const loginButton = createBtn('login-button', 'Login', userControls);
    loginButton.addEventListener('click', () => {
      router.navigateTo(Pages.LOGIN);
    });

    const registerButton = createBtn(
      'register-button',
      'Register',
      userControls
    );
    registerButton.addEventListener('click', () => {
      router.navigateTo(Pages.REGISTRATION);
    });
  }

  getHeaderElement() {
    return this.container;
  }
}
