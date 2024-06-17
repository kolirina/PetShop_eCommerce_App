import {
  Cart,
  ClientResponse,
  DiscountCode,
  LineItem,
} from '@commercetools/platform-sdk';
import { applyCode, getCartById, getDiscountCodeById } from '../../api/SDK';
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
import checkAnonymousToken from '../../utils/checkAnonymousToken';
import getCartStatus from '../../utils/checkCartStatus';
import { lang } from '../../constants';
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

  public appliedCodesWrapper: HTMLDivElement;

  public appliedCodesHeading: HTMLHeadingElement;

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

    this.appliedCodesWrapper = createDiv(styles.appliedCodesWrapper);
    this.appliedCodesHeading = createH3(
      styles.appliedCodesHeading,
      'Applied promo codes:',
      this.appliedCodesWrapper
    );

    checkAnonymousToken();

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
      this.promoApplyBtn.addEventListener(
        'click',
        this.applyPromoCode.bind(this)
      );
      this.productsWrapper.append(this.clearCartBtn);
      this.fillAppliedCodes();
      this.checkProductQuantityInCart();
    }
  }

  private async fillAppliedCodes() {
    if (this.cartInfo && this.cartInfo.lineItems.length > 0) {
      const { discountCodes } = this.cartInfo;
      if (discountCodes.length > 0) {
        const promises = discountCodes.map((el) =>
          getDiscountCodeById(el.discountCode.id)
        );
        const codesInfo = await Promise.all(promises);
        codesInfo.forEach((el: ClientResponse<DiscountCode> | string) => {
          if (typeof el !== 'string' && el.body.name) {
            const codeName = el.body.name[lang];
            const addedCodes = document.querySelectorAll(
              `.${styles.codeElement}`
            );
            const wasCodeAdded = Array.from(addedCodes).find(
              (e) => e.textContent === codeName
            );
            if (!wasCodeAdded) {
              createParagraph(
                styles.codeElement,
                codeName,
                this.appliedCodesWrapper
              );
            }
          }
        });
        this.productsWrapper.append(this.appliedCodesWrapper);
      }
    }
  }

  private checkProductQuantityInCart(): void {
    if (this.cartInfo && this.cartInfo.lineItems.length > 0) {
      this.noProductsMessage.remove();
      this.goToCatalogBtn.remove();
      this.totalPrice.textContent = `${TOTAL_PRICE_TEXT}${priceFormatter(this.cartInfo.totalPrice.centAmount)}`;
      this.productsWrapper.append(this.promoAndTotalWrapper);
      this.productsWrapper.append(this.appliedCodesWrapper);
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

          const cartStatus = getCartStatus();
          localStorage.setItem(`${cartStatus}_version`, String(result.version));
        }, Promise.resolve())
        .then(() => {
          this.productsWrapper.innerHTML = '';
        });
      this.checkProductQuantityInCart();
      this.header.updateCartCounter();
      document.querySelector(`.${styles.background}`)?.remove();
      this.productsArr = [];
      this.header.updateCartCounter();
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
      background.addEventListener('click', (e) => {
        if (e.target === background) {
          background.remove();
        }
      });
      confirmBtn.addEventListener('click', this.clearCart.bind(this));
      declineBtn.addEventListener('click', () => background.remove());
      window.addEventListener('popstate', () => background.remove());
    }
  }

  private async applyPromoCode(): Promise<void> {
    this.promoWrapper.querySelector(`.${styles.errorMsg}`)?.remove();
    this.promoInput.classList.remove(styles.errorInput);
    if (this.cartInfo) {
      const response = await applyCode(
        this.cartInfo.id,
        this.promoInput.value.toUpperCase()
      );
      if (typeof response === 'string') {
        const errorMsg = createDiv(styles.errorMsg, this.promoWrapper);
        errorMsg.textContent = `* ${response}`;
        this.promoInput.classList.add(styles.errorInput);
        return;
      }
      this.promoInput.value = '';
      this.cartInfo = response.body;
      this.updateFields();
      this.fillAppliedCodes();
      this.productsArr.forEach((el, index) => {
        el.updateProduct(response.body.lineItems[index]);
      });
    }
  }

  private updateFields(): void {
    if (this.cartInfo) {
      const cartStatus = getCartStatus();
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
