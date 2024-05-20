import Router from '../../router';
import Pages from '../../router/pageNames';
import {
  createDiv,
  createH1,
  createLocalLink,
  createParagraph,
} from '../../utils/elementCreator';
import Page from '../Page';
import image from '../../assets/notfound.png';
import styles from './notFoundPage.module.css';

class NotFoundPage extends Page {
  constructor(router: Router, parentElement: HTMLElement) {
    super(router, parentElement);
    this.container.classList.add(styles.container);
    const info = createDiv(styles.info, this.container);
    createParagraph(styles.error, '404', info);
    createH1(styles.h1, 'Oops!', info);
    createParagraph(
      styles.description,
      `We are very sorry for the inconvenience.
      It looks like you're trying to access a page that either has been deleted or never existed.`,
      info
    );
    createLocalLink(
      styles.home,
      'Go Home',
      Pages.MAIN,
      () => router.navigateTo(Pages.MAIN),
      info
    );
    const errorImage = document.createElement('img');
    errorImage.classList.add(styles.errorImage);
    errorImage.src = image;
    this.container.append(errorImage);
  }
}

export default NotFoundPage;
