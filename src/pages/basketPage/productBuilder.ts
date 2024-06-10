import { createDiv } from '../../utils/elementCreator';
import styles from './backetPage.module.css';

class Product {
  public productWrapper: HTMLDivElement;

  // public productImage: HTMLImageElement;

  constructor() {
    this.productWrapper = createDiv(styles.productWrapper);
    // this.container.textContent = 'My Basket';
  }

  public getProduct() {
    return this.productWrapper;
  }
}

export default Product;
