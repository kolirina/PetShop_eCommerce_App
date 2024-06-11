import { LineItem } from '@commercetools/typescript-sdk';
import { getCartById } from '../../api/SDK';
import Router from '../../router';
import Pages from '../../router/pageNames';
import {
  createBtn,
  createDiv,
  createParagraph,
} from '../../utils/elementCreator';
import Page from '../Page';
import styles from './basketPage.module.css';
import Product from './productBuilder';

class BasketPage extends Page {
  public productsWrapper: HTMLDivElement;

  public noProductsMessage: HTMLParagraphElement;

  public goToCatalogBtn: HTMLButtonElement;

  constructor(router: Router, parentElement: HTMLElement) {
    super(router, parentElement);
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

  private async fillCart(): Promise<void> {
    const cartLocalStorage = localStorage.getItem('registered_user_cart_id')
      ? localStorage.getItem('registered_user_cart_id')
      : localStorage.getItem('anonymous_cart_id');
    if (cartLocalStorage) {
      this.goToCatalogBtn.remove();
      this.noProductsMessage.remove();
      try {
        const result = await getCartById(cartLocalStorage);
        result.body.lineItems.forEach((el: LineItem) => {
          const item = new Product(el);
          this.productsWrapper.append(item.getProduct());
        });
        // console.log(result);
      } catch (err) {
        // console.error((err as Error).message);
      }
    }
    // return this.cartInfo;
  }

  // private paintProduct() {
  //   const product: HTMLDivElement = new Product().getProduct();
  //   this.productsWrapper.append(product);
  // }
}

export default BasketPage;
