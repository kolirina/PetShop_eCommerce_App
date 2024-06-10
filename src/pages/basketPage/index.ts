import { getCartById } from '../../api/SDK';
import Router from '../../router';
import Pages from '../../router/pageNames';
import {
  createBtn,
  createDiv,
  createParagraph,
} from '../../utils/elementCreator';
import Page from '../Page';
import styles from './backetPage.module.css';
import Product from './productBuilder';

class BasketPage extends Page {
  // public router: Router;
  public productsWrapper: HTMLDivElement;

  public noProductsMessage: HTMLParagraphElement;

  public goToCatalogBtn: HTMLButtonElement;

  // private cartInfo:

  constructor(router: Router, parentElement: HTMLElement) {
    super(router, parentElement);
    // this.router = router
    this.container.classList.add(styles.container);
    this.productsWrapper = createDiv(
      styles.basketProductsWrapper,
      this.container
    );

    this.noProductsMessage = createParagraph(
      styles.noProducts,
      'No products added. Please choose products.',
      this.productsWrapper
    );

    this.goToCatalogBtn = createBtn(
      styles.goToCatalogBtn,
      'Go to the Catalog',
      this.productsWrapper
    );

    this.goToCatalogBtn.addEventListener('click', () => {
      router.navigateTo(Pages.CATALOG);
    });

    this.fillCart();
  }

  private async fillCart() {
    // const cartLocalStorage = localStorage.getItem('');
    // if (cartLocalStorage) {
    // const cartId = JSON.parse(cartLocalStorage);
    const cartInfo = await getCartById('asdasd');
    this.paintProduct();
    return { 1: cartInfo, 2: this.goToCatalogBtn };
  }

  private paintProduct() {
    const product: HTMLDivElement = new Product().getProduct();
    this.productsWrapper.append(product);
  }
}

export default BasketPage;
