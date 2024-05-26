import Router from '../../router';
import Page from '../Page';

class ProductPage extends Page {
  id: string;

  constructor(router: Router, parentElement: HTMLElement) {
    super(router, parentElement);
    const match = window.location.pathname.match(/^\/product\/([a-z0-9-]+)$/);
    this.id = match ? match[1] : 'Error';
    this.container.textContent = `Product with id: ${this.id}`;
  }
}
export default ProductPage;
