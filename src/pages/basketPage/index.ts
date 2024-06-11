import { Cart, LineItem } from '@commercetools/platform-sdk';
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

  private cartInfo?: Cart;

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
      try {
        const result = await getCartById(cartLocalStorage);
        this.cartInfo = await result.body;
        if (this.cartInfo && this.cartInfo.lineItems.length > 0) {
          this.goToCatalogBtn.remove();
          this.noProductsMessage.remove();
        }
        result.body.lineItems.forEach((el: LineItem) => {
          const item = new Product(el);
          this.productsWrapper.append(item.getProduct());
          item.productDeleteBtn.addEventListener('click', () =>
            this.deleteHandler(item)
          );
        });
      } catch (err) {
        // console.error((err as Error).message);
      }
    }
  }

  private async deleteHandler(item: Product) {
    if (this.cartInfo) {
      const deleteResult = await item.deleteProduct.bind(
        item,
        this.cartInfo.id,
        this.cartInfo.version
      )();
      if (deleteResult) {
        this.cartInfo = deleteResult;
        this.updateFields();
      }
    }
  }

  private updateFields() {
    if (this.cartInfo) {
      const cartStatus = localStorage.getItem('anonymous_cart_id')
        ? 'anonymous_cart'
        : 'registered_user_cart';
      localStorage.setItem(
        `${cartStatus}_version`,
        String(this.cartInfo.version)
      );
      if (this.cartInfo.lineItems.length === 0) {
        this.productsWrapper.append(this.noProductsMessage);
        this.productsWrapper.append(this.goToCatalogBtn);
      }
    }
  }
}

export default BasketPage;
