import Router from '../../router';
import Page from '../Page';

class BasketPage extends Page {
  constructor(router: Router, parentElement: HTMLElement) {
    super(router, parentElement);
    this.container.textContent = 'My Basket';
  }
}

export default BasketPage;
