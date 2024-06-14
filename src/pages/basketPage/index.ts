import { Cart, LineItem } from '@commercetools/platform-sdk';
import { getCartById } from '../../api/SDK';
import Router from '../../router';
import Pages from '../../router/pageNames';
import {
  createBtn,
  createDiv,
  createH3,
  createInput,
  createParagraph,
} from '../../utils/elementCreator';
import Page from '../Page';
import Product from './productBuilder';
import priceFormatter from '../../utils/priceFormatter';
import { TOTAL_PRICE_TEXT } from './constants';
import TemplatePage from '../templatePage';
import Header from '../../components/header';
import styles from './basketPage.module.css';
import pageStyle from '../templatePage/templatePage.module.css';

class BasketPage extends Page {
  public header: Header;

  public productsWrapper: HTMLDivElement;

  public noProductsMessage: HTMLParagraphElement;

  public goToCatalogBtn: HTMLButtonElement;

  private cartInfo?: Cart;

  public totalPrice: HTMLHeadingElement;

  public promoAndTotalWrapper: HTMLDivElement;

  public promoWrapper: HTMLDivElement;

  public promoHeading: HTMLHeadingElement;

  public promoInput: HTMLInputElement;

  public promoApplyBtn: HTMLButtonElement;

  public clearCartBtn: HTMLButtonElement;

  private productsArr: Product[];

  constructor(router: Router, templatePage: TemplatePage) {
    super(router, templatePage.getMainElement());
    this.header = templatePage.getHeader();
    this.container.classList.add(styles.container);
    this.productsWrapper = createDiv(
      styles.basketProductsWrapper,
      this.container
    );

    this.productsArr = [];

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

    this.promoAndTotalWrapper = createDiv(styles.promoAndTotalWrapper);

    this.promoWrapper = createDiv(
      styles.promoWrapper,
      this.promoAndTotalWrapper
    );
    this.promoHeading = createH3(
      styles.promoHeading,
      'Enter promo code: ',
      this.promoWrapper
    );
    this.promoInput = createInput({
      className: styles.promoInput,
      type: 'text',
      placeholder: 'Code',
      parentElement: this.promoWrapper,
    });
    this.promoApplyBtn = createBtn(
      styles.promoApplyBtn,
      'Apply',
      this.promoWrapper
    );

    this.totalPrice = createH3(
      styles.totalPrice,
      'Total price: ',
      this.promoAndTotalWrapper
    );

    this.fillCart();

    this.clearCartBtn = createBtn(styles.clearCartBtn, 'Clear cart');

    this.clearCartBtn.addEventListener(
      'click',
      this.paintConfirmation.bind(this)
    );

    this.goToCatalogBtn.addEventListener('click', () => {
      router.navigateTo(Pages.CATALOG);
    });
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
        this.productsArr.push(item);
      });
      this.productsWrapper.append(this.clearCartBtn);
      this.checkProductQuantityInCart();
    }
  }

  private checkProductQuantityInCart(): void {
    if (this.cartInfo && this.cartInfo.lineItems.length > 0) {
      this.noProductsMessage.remove();
      this.goToCatalogBtn.remove();
      this.totalPrice.textContent = `${TOTAL_PRICE_TEXT}${priceFormatter(this.cartInfo.totalPrice.centAmount)}`;
      this.productsWrapper.append(this.promoAndTotalWrapper);
    } else {
      this.productsWrapper.innerHTML = '';
      this.productsWrapper.append(this.noProductsMessage);
      this.productsWrapper.append(this.goToCatalogBtn);
    }
  }

  private async deleteHandler(item: Product): Promise<void> {
    if (this.cartInfo) {
      this.productsArr = this.productsArr.filter((e) => e !== item);
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

  private async clearCart() {
    if (this.cartInfo) {
      let cartVersion = this.cartInfo.version;
      const cartId = this.cartInfo.id;
      await this.productsArr
        .reduce(async (promise, product) => {
          await promise;
          const result = await product.deleteProduct.bind(
            product,
            cartId,
            cartVersion,
            true
          )();
          cartVersion = result.version;
          this.cartInfo = result;

          const cartStatus = localStorage.getItem('anonymous_cart_id')
            ? 'anonymous_cart'
            : 'registered_user_cart';
          localStorage.setItem(`${cartStatus}_version`, String(result.version));
        }, Promise.resolve())
        .then(() => {
          this.productsWrapper.innerHTML = '';
        });
      this.checkProductQuantityInCart();
      document.querySelector(`.${styles.background}`)?.remove();
      this.productsArr = [];
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

  private paintConfirmation() {
    const body = document.querySelector(`.${pageStyle.page}`);
    if (body) {
      const background = createDiv(styles.background, body as HTMLElement);
      const confirmationWrapper = createDiv(
        styles.confirmationWrapper,
        background
      );
      createParagraph(
        styles.confirmationText,
        'All items will be deleted from cart. Continue?',
        confirmationWrapper
      );

      const confirmationButtonWrapper = createDiv(
        styles.confirmationButtonWrapper,
        confirmationWrapper
      );
      const confirmBtn = createBtn(
        styles.confirmBtn,
        'Yes',
        confirmationButtonWrapper
      );
      const declineBtn = createBtn(
        styles.confirmBtn,
        'No',
        confirmationButtonWrapper
      );
      background.addEventListener('click', () => background.remove());
      confirmBtn.addEventListener('click', this.clearCart.bind(this));
      declineBtn.addEventListener('click', () => background.remove());
      window.addEventListener('popstate', () => background.remove());
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
      this.checkProductQuantityInCart();
    }
  }
}

export default BasketPage;
