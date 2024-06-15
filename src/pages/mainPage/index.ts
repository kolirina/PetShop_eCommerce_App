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
import loginBackground from '../../assets/login_bg.png';
import registrationBackground from '../../assets/registration_bg.png';
import profileBackground from '../../assets/profile_bg.png';
import catalogBackground from '../../assets/catalog_bg.png';
import isLoggedIn from '../../utils/checkFunctions';

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
    const pages = [
      {
        name: 'Login',
        page: Pages.LOGIN,
        description: 'Login to your account',
        image: loginBackground,
      },
      {
        name: 'Register',
        page: Pages.REGISTRATION,
        description: 'Create a new account',
        image: registrationBackground,
      },
      {
        name: 'Profile',
        page: Pages.PROFILE,
        description: 'View your profile',
        image: profileBackground,
      },
      {
        name: 'Catalog',
        page: Pages.CATALOG,
        description: 'Browse our catalog',
        image: catalogBackground,
      },
      {
        name: 'About us',
        page: Pages.ABOUT_US,
        description: 'Info about our team',
        image: '',
      },
    ];

    const cardContainer = createDiv(styles.cardContainer, this.container);

    pages.forEach(({ name, page, description, image }) => {
      const card = createLocalLink(
        styles.card,
        '',
        page,
        () => {
          if (
            isLoggedIn() &&
            (page === Pages.LOGIN || page === Pages.REGISTRATION)
          ) {
            MainPage.displayWarning('You are already signed in!');
          } else if (!isLoggedIn() && page === Pages.PROFILE) {
            MainPage.displayWarning('You are not signed in!');
          } else {
            this.router.navigateTo(page);
          }
        },
        cardContainer
      );
      card.style.backgroundImage = `url(${image})`;

      const cardContent = createDiv(styles.cardContent, card);
      createParagraph(styles.cardTitle, name, cardContent);
      createParagraph(styles.cardDescription, description, cardContent);
    });
  }

  static displayWarning(text: string) {
    document.body.classList.add(styles.noscroll);
    const background = createDiv(styles.background, document.body);
    const warningWrapper = createDiv(styles.warningWrapper, background);
    createParagraph(styles.warningText, text, warningWrapper);
    const removeWarning = () => {
      background.remove();
      document.body.classList.remove(styles.noscroll);
    };
    background.addEventListener('click', removeWarning);
    window.addEventListener('popstate', removeWarning);
  }
}

export default MainPage;
