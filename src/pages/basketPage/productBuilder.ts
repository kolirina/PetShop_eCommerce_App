import { LineItem } from '@commercetools/typescript-sdk';
import {
  createBtn,
  createDiv,
  createH3,
  createImg,
  createInput,
  createSpan,
} from '../../utils/elementCreator';
import styles from './basketPage.module.css';
import { FIRST_PIC } from './constants';
import noImage from '../../assets/no-image.png';
import { lang } from '../../constants';
import priceFormatter from '../../utils/priceFormatter';

class Product {
  public productWrapper: HTMLDivElement;

  private productInfo: LineItem;

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

  public productPriceText: HTMLHeadingElement;

  public productDeleteBtn: HTMLButtonElement;

  constructor(item: LineItem) {
    this.productInfo = item;
    this.productAmount = item.quantity;
    this.productPrice = item.price.value.centAmount;

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

    this.productPriceText = createH3(
      styles.productPriceText,
      priceFormatter(this.productPrice),
      this.amountAndPriceWrapper
    );

    this.productDeleteBtn = createBtn(
      styles.productDeleteBtn,
      'Remove ',
      this.amountAndPriceWrapper
    );

    this.productAmountDecBtn.addEventListener(
      'click',
      this.minusOne.bind(this)
    );
    // console.log(item);
  }

  private getImgUrl(): string {
    const imgArr = this.productInfo.variant.images;
    if (imgArr) {
      return imgArr[FIRST_PIC].url;
    }
    return noImage;
  }

  private getBrandName() {
    const brand = this.productInfo.variant.attributes;
    if (brand) {
      return brand.find((el) => el.name === 'brand')?.value;
    }
    return '';
  }

  private minusOne() {
    this.productAmountInput.value = String(
      Number(this.productAmountInput.value) - 1
    );
    if (this.productAmountInput.value === '1') {
      this.productAmountInput.disabled = true;
    }
  }

  public getProduct(): HTMLDivElement {
    return this.productWrapper;
  }
}

export default Product;
