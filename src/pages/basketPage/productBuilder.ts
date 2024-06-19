import { Cart, LineItem } from '@commercetools/platform-sdk';
import {
  createBtn,
  createDiv,
  createH3,
  createImg,
  createInput,
  createSpan,
} from '../../utils/elementCreator';
import { FIRST_PIC } from './constants';
import noImage from '../../assets/no-image.png';
import { lang } from '../../constants';
import priceFormatter from '../../utils/priceFormatter';
import { changeProductQuantity, deleteProductFromCart } from '../../api/SDK';
import pageStyle from '../templatePage/templatePage.module.css';
import styles from './basketPage.module.css';

function showError() {
  const body = document.querySelector(`.${pageStyle.page}`);
  const bg = createDiv(styles.background, body as HTMLElement);
  bg.append(
    createH3(styles.deletionError, 'Can`t delete product at the moment.')
  );
  bg.addEventListener('click', () => bg.remove());
}

class Product {
  public productWrapper: HTMLDivElement;

  public productInfo: LineItem;

  private productAmount: number;

  private productPrice: number;

  public imgAndTextWrapper: HTMLDivElement;

  public productImage: HTMLImageElement;

  public productTextWrapper: HTMLDivElement;

  public productName: HTMLSpanElement;

  public productBrand: HTMLHeadingElement;

  public amountAndPriceWrapper: HTMLDivElement;

  public productAmountWrapper: HTMLDivElement;

  public productAmountDecBtn: HTMLButtonElement;

  public productAmountIncBtn: HTMLButtonElement;

  public productAmountInput: HTMLInputElement;

  public productPriceWrapper: HTMLDivElement;

  public productPriceText: HTMLHeadingElement;

  public originalPrice: HTMLHeadingElement;

  public productDeleteBtn: HTMLButtonElement;

  constructor(item: LineItem) {
    this.productInfo = item;
    this.productAmount = item.quantity;
    this.productPrice = item.totalPrice.centAmount;

    this.productWrapper = createDiv(styles.productWrapper);

    this.imgAndTextWrapper = createDiv(
      styles.imgAndTextWrapper,
      this.productWrapper
    );
    this.productImage = createImg(
      styles.productImage,
      this.getImgUrl(),
      this.getBrandName(),
      this.imgAndTextWrapper
    );

    this.productTextWrapper = createDiv(
      styles.textWrapper,
      this.imgAndTextWrapper
    );
    this.productBrand = createH3(
      styles.productBrand,
      this.getBrandName(),
      this.productTextWrapper
    );
    this.productName = createSpan(
      styles.productName,
      this.productInfo.name[lang],
      this.productTextWrapper
    );

    this.amountAndPriceWrapper = createDiv(
      styles.amountAndPriceWrapper,
      this.productWrapper
    );
    this.productAmountWrapper = createDiv(
      styles.productAmountWrapper,
      this.amountAndPriceWrapper
    );
    this.productAmountDecBtn = createBtn(
      styles.productAmountBtn,
      '-',
      this.productAmountWrapper
    );
    this.productAmountDecBtn.disabled = this.productAmount < 2;
    this.productAmountInput = createInput({
      className: styles.productAmountInput,
      type: 'text',
      parentElement: this.productAmountWrapper,
    });
    this.productAmountInput.value = String(this.productAmount);
    this.productAmountIncBtn = createBtn(
      styles.productAmountBtn,
      '+',
      this.productAmountWrapper
    );
    this.productAmountInput.disabled = true;

    this.productPriceWrapper = createDiv(
      styles.productPriceWrapper,
      this.amountAndPriceWrapper
    );
    this.originalPrice = createH3(styles.productOriginalPrice, '');
    this.originalPrice.textContent = `${priceFormatter(this.productInfo.price.value.centAmount)}`;
    if (this.productAmount > 1) {
      this.productPriceWrapper.prepend(this.originalPrice);
    }
    this.productPriceText = createH3(
      styles.productPriceText,
      priceFormatter(this.productPrice),
      this.productPriceWrapper
    );
    this.addOriginalPrice();

    this.productDeleteBtn = createBtn(
      styles.productDeleteBtn,
      'Remove ',
      this.amountAndPriceWrapper
    );
  }

  private getImgUrl(): string {
    const imgArr = this.productInfo.variant.images;
    if (imgArr) {
      return imgArr[FIRST_PIC].url;
    }
    return noImage;
  }

  private getBrandName(): string {
    const brand = this.productInfo.variant.attributes;
    if (brand) {
      return brand.find((el) => el.name === 'brand')?.value;
    }
    return '';
  }

  private addOriginalPrice() {
    if (
      this.productInfo.discountedPricePerQuantity.length > 0 ||
      this.productInfo.price.discounted
    ) {
      this.productPriceText.classList.add(styles.discountedPrice);
      this.originalPrice.classList.add(styles.productOriginalPriceDiscounted);
      this.productPriceWrapper.prepend(this.originalPrice);
    }
  }

  public async deleteProduct(
    cartId: string,
    cartVersion: number,
    clear = false
  ): Promise<void | Cart> {
    let data;
    try {
      const response = await deleteProductFromCart(
        cartId,
        this.productInfo.id,
        cartVersion
      );
      if (this.productWrapper && this.productWrapper.parentNode && !clear) {
        this.productWrapper.parentNode.removeChild(this.productWrapper);
      }
      data = response;
    } catch (err) {
      if (!clear) {
        showError();
      } else {
        throw new Error('Error');
      }
    }
    return data;
  }

  public async changeQuantity(
    cartId: string,
    cartVersion: number,
    target: HTMLButtonElement
  ): Promise<Cart> {
    const targetBtn = target;
    targetBtn.disabled = true;
    let quantity = Number(this.productAmountInput.value);
    if (target === this.productAmountDecBtn) {
      quantity -= 1;
    }
    if (target === this.productAmountIncBtn) {
      quantity += 1;
    }
    const response = await changeProductQuantity(
      cartId,
      this.productInfo.id,
      cartVersion,
      quantity
    ).then((result) => {
      targetBtn.disabled = false;
      const changedProduct = result.lineItems.find(
        (el) => el.id === this.productInfo.id
      );
      if (changedProduct) {
        this.productInfo = changedProduct;
      }
      this.updatePriceAndQuantity();
      return result;
    });
    return response;
  }

  private updatePriceAndQuantity(): void {
    this.productPrice = this.productInfo.totalPrice.centAmount;
    this.productPriceText.textContent = priceFormatter(this.productPrice);
    this.productAmount = this.productInfo.quantity;
    this.productAmountInput.value = String(this.productAmount);
    if (this.productAmount === 1) {
      this.productAmountDecBtn.disabled = true;
      this.originalPrice.remove();
    } else {
      this.productAmountDecBtn.disabled = false;
      this.productPriceWrapper.prepend(this.originalPrice);
    }
  }

  public updateProduct(product: LineItem) {
    this.productInfo = product;
    if (this.productInfo.discountedPricePerQuantity.length > 0) {
      const originalPrice = this.productPriceWrapper.querySelector(
        `.${styles.productOriginalPrice}`
      );
      if (!originalPrice) {
        this.addOriginalPrice();
      }
      this.productPriceText.classList.add(styles.discounted);
      this.productPriceText.textContent = `${priceFormatter(this.productInfo.totalPrice.centAmount)}`;
    }
  }

  public getProduct(): HTMLDivElement {
    return this.productWrapper;
  }
}

export default Product;
