import Footer from '../../components/footer';
import Header from '../../components/header';
import Router from '../../router';
import Page from '../Page';
import styles from './templatePage.module.css';

export default class TemplatePage extends Page {
  private main: HTMLElement;

  private header: Header;

  constructor(router: Router, parentElement: HTMLElement) {
    super(router, parentElement);
    this.main = document.createElement('main');
    this.main.classList.add(styles.main);
    this.container.classList.add(styles.page);
    this.header = new Header(router);
    this.container.append(
      this.header.getHeaderElement(),
      this.main,
      new Footer().getFooterElement()
    );
  }

  getHeader() {
    return this.header;
  }

  getMainElement() {
    return this.main;
  }

  getPageContainer() {
    return this.container;
  }
}
