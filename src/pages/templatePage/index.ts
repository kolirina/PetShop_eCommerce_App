import Footer from '../../components/footer';
import Header from '../../components/header';
import Router from '../../router';
import Page from '../Page';

export default class TemplatePage extends Page {
  private main: HTMLElement;

  constructor(router: Router, parentElement: HTMLElement) {
    super(router, parentElement);
    this.main = document.createElement('main');
    this.container.append(
      new Header(router).getHeaderElement(),
      this.main,
      new Footer().getFooterElement()
    );
  }

  getMainElement() {
    return this.main;
  }
}
