import { getAllDiscountCodes } from '../../api/SDK';
import { lang } from '../../constants';
import Router from '../../router';
import Pages from '../../router/pageNames';
import {
  createBtn,
  createDiv,
  createLocalLink,
  createParagraph,
} from '../../utils/elementCreator';
import Page from '../Page';
import styles from './mainPage.module.css';

class MainPage extends Page {
  constructor(router: Router, parentElement: HTMLElement) {
    super(router, parentElement);
    this.container.classList.add(styles.container);
    this.displayDiscountCoupons();
  }

  async displayDiscountCoupons() {
    const response = await getAllDiscountCodes();
    if (response.statusCode === 200 && response.body.total) {
      createParagraph(
        styles.promoHead,
        'Available discount codes:',
        this.container
      );
      const promoContainer = createDiv(styles.promoContainer, this.container);
      response.body.results.forEach((promocode) => {
        if (promocode.isActive) {
          const coupon = createDiv(styles.coupon, promoContainer);
          createParagraph(styles.name, promocode.name![lang], coupon);
          createParagraph(
            styles.description,
            promocode.description![lang],
            coupon
          );
          const copyContainer = createDiv(styles.copyContainer, coupon);
          createParagraph(styles.code, promocode.code, copyContainer);
          const copyButton = createBtn(
            styles.copyButton,
            'Copy',
            copyContainer
          );
          copyButton.addEventListener('click', () =>
            navigator.clipboard.writeText(promocode.code).then(() => {
              copyButton.textContent = 'Copied!';
              setTimeout(() => {
                copyButton.textContent = 'Copy';
              }, 3000);
            })
          );
        }
      });
    }
    this.displayLinks();
  }

  displayLinks() {
    createLocalLink(
      styles.link,
      'Login',
      Pages.LOGIN,
      () => this.router.navigateTo(Pages.LOGIN),
      this.container
    );
    createLocalLink(
      styles.link,
      'Register',
      Pages.REGISTRATION,
      () => this.router.navigateTo(Pages.REGISTRATION),
      this.container
    );
    createLocalLink(
      styles.link,
      'Profile',
      Pages.PROFILE,
      () => this.router.navigateTo(Pages.PROFILE),
      this.container
    );
    createLocalLink(
      styles.link,
      'Catalog',
      Pages.CATALOG,
      () => this.router.navigateTo(Pages.CATALOG),
      this.container
    );
  }
}

export default MainPage;
