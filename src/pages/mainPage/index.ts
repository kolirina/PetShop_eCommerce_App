import Router from '../../router';
import Pages from '../../router/pageNames';
import { createLocalLink } from '../../utils/elementCreator';
import Page from '../Page';
import styles from './mainPage.module.css';

class MainPage extends Page {
  constructor(router: Router, parentElement: HTMLElement) {
    super(router, parentElement);
    this.container.classList.add(styles.container);
    createLocalLink(
      styles.link,
      'Login',
      Pages.LOGIN,
      () => router.navigateTo(Pages.LOGIN),
      this.container
    );
    createLocalLink(
      styles.link,
      'Register',
      Pages.REGISTRATION,
      () => router.navigateTo(Pages.REGISTRATION),
      this.container
    );
    createLocalLink(
      styles.link,
      'Profile',
      Pages.PROFILE,
      () => router.navigateTo(Pages.PROFILE),
      this.container
    );
    createLocalLink(
      styles.link,
      'Catalog',
      Pages.CATALOG,
      () => router.navigateTo(Pages.CATALOG),
      this.container
    );
  }
}

export default MainPage;
