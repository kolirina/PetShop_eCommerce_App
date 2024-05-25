import Router from '../../router';
import Page from '../Page';

class ProductPage extends Page {
  id: string;

  constructor(router: Router, parentElement: HTMLElement) {
    super(router, parentElement);
    const match = window.location.pathname.match(/\d+/);
    [this.id] = match ?? 'Error';
    this.container.textContent = `Product with id: ${this.id}`;
  }
}
export default ProductPage;
