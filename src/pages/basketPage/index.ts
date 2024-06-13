import { Cart, LineItem } from '@commercetools/platform-sdk';
import { getCartById } from '../../api/SDK';
import Router from '../../router';
import Pages from '../../router/pageNames';
import {
  createBtn,
  createDiv,
  createH3,
  createParagraph,
} from '../../utils/elementCreator';
import Page from '../Page';
import styles from './basketPage.module.css';
import Product from './productBuilder';
import priceFormatter from '../../utils/priceFormatter';
import { TOTAL_PRICE_TEXT } from './constants';
import TemplatePage from '../templatePage';
import Header from '../../components/header';

class BasketPage extends Page {
  public header: Header;

  public productsWrapper: HTMLDivElement;

  public noProductsMessage: HTMLParagraphElement;

  public goToCatalogBtn: HTMLButtonElement;

  private cartInfo?: Cart;

  public totalPrice: HTMLHeadingElement;

  constructor(router: Router, templatePage: TemplatePage) {
    super(router, templatePage.getMainElement());
    this.header = templatePage.getHeader();
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

    this.totalPrice = createH3(styles.totalPrice, 'Total price: ');

    this.fillCart();
  }

  private async fillCart(): Promise<void> {
    const cartLocalStorage = localStorage.getItem('registered_user_cart_id')
      ? localStorage.getItem('registered_user_cart_id')
      : localStorage.getItem('anonymous_cart_id');
    if (cartLocalStorage) {
      const result = await getCartById(cartLocalStorage);
      this.cartInfo = await result.body;
      result.body.lineItems.forEach((el: LineItem) => {
        const item = new Product(el);
        this.productsWrapper.append(item.getProduct());
        item.productDeleteBtn.addEventListener('click', () =>
          this.deleteHandler(item)
        );
        item.productAmountDecBtn.addEventListener('click', (e) =>
          this.quantityHandler(item, e)
        );
        item.productAmountIncBtn.addEventListener('click', (e) =>
          this.quantityHandler(item, e)
        );
      });

      if (this.cartInfo && this.cartInfo.lineItems.length > 0) {
        this.goToCatalogBtn.remove();
        this.noProductsMessage.remove();
        this.totalPrice.textContent = `${TOTAL_PRICE_TEXT}${priceFormatter(this.cartInfo.totalPrice.centAmount)}`;
        this.productsWrapper.append(this.totalPrice);
      }
    }
  }

  private async deleteHandler(item: Product): Promise<void> {
    if (this.cartInfo) {
      const deleteResult = await item.deleteProduct.bind(
        item,
        this.cartInfo.id,
        this.cartInfo.version
      )();
      if (deleteResult) {
        this.cartInfo = deleteResult;
        this.updateFields();
        this.header.updateCartCounter();
      }
    }
  }

  private async quantityHandler(item: Product, e: Event): Promise<void> {
    const target = e.target as HTMLElement;
    if (this.cartInfo) {
      const amountResult = await item.changeQuantity.bind(
        item,
        this.cartInfo.id,
        this.cartInfo.version,
        target
      )();
      if (amountResult) {
        this.cartInfo = amountResult;
        this.updateFields();
        this.header.updateCartCounter();
      }
    }
  }

  private updateFields(): void {
    if (this.cartInfo) {
      const cartStatus = localStorage.getItem('anonymous_cart_id')
        ? 'anonymous_cart'
        : 'registered_user_cart';
      localStorage.setItem(
        `${cartStatus}_version`,
        String(this.cartInfo.version)
      );
      this.totalPrice.textContent = `${TOTAL_PRICE_TEXT}${priceFormatter(this.cartInfo.totalPrice.centAmount)}`;
      if (this.cartInfo.lineItems.length === 0) {
        this.totalPrice.remove();
        this.productsWrapper.append(this.noProductsMessage);
        this.productsWrapper.append(this.goToCatalogBtn);
      }
    }
  }
}

export default BasketPage;
