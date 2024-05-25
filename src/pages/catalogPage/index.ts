import Router from '../../router';
import Page from '../Page';

class CatalogPage extends Page {
  constructor(router: Router, parentElement: HTMLElement) {
    super(router, parentElement);
    this.container.textContent = 'Catalog';
  }
}
export default CatalogPage;
