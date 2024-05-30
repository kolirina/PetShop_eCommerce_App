import { getProduct } from '../../api/SDK';
import Router from '../../router';
import {
  createBtn,
  createDiv,
  createImg,
  createParagraph,
} from '../../utils/elementCreator';
import priceFormatter from '../../utils/priceFormatter';
import Page from '../Page';
import { isDescription, isSpecification } from './constants';
import styles from './productPage.module.css';

class ProductPage extends Page {
  id: string;

  currentIndex: number = 0;

  carousel: HTMLDivElement;

  constructor(router: Router, parentElement: HTMLElement) {
    super(router, parentElement);
    this.container.classList.add(styles.productPage);
    this.carousel = createDiv(styles.carousel);
    const match = window.location.pathname.match(/^\/product\/([a-z0-9-]+)$/);
    this.id = match ? match[1] : 'Error';
    this.displayProductInfo();
  }

  moveCarousel(direction: number) {
    const totalImages = this.carousel.childElementCount;
    this.currentIndex =
      (this.currentIndex + direction + totalImages) % totalImages;
    this.carousel.style.transform = `translateX(-${this.currentIndex * 100}%)`;
  }

  async displayProductInfo() {
    const response = await getProduct(this.id);
    if (response.statusCode === 200) {
      const product = response.body.masterData.current;
      const baseInfo = createDiv(styles.baseInfo, this.container);
      const imageContainer = createDiv(styles.imageContainer, baseInfo);
      imageContainer.append(this.carousel);
      product.masterVariant.images?.forEach((image) => {
        createImg(styles.productImage, image.url, 'product', this.carousel);
      });
      const prevButton = createBtn(styles.carouselButton, '<', imageContainer);
      prevButton.classList.add(styles.prevButton);
      prevButton.addEventListener('click', () => this.moveCarousel(-1));
      const nextButton = createBtn(styles.carouselButton, '>', imageContainer);
      nextButton.classList.add(styles.nextButton);
      nextButton.addEventListener('click', () => this.moveCarousel(1));

      const infoContainer = createDiv(styles.infoContainer, baseInfo);
      createParagraph(styles.productName, product.name['en-US'], infoContainer);
      const shortDescription =
        product.description!['en-US'] ?? 'No description available';
      createParagraph(styles.shortDescription, shortDescription, infoContainer);

      const priceDiv = createDiv('priceDiv', infoContainer);
      const regularPriceDiv = createDiv('regularPrice', priceDiv);
      if (product.masterVariant.prices) {
        if (product.masterVariant.prices[0].value) {
          const regularPrice = product.masterVariant.prices[0].value.centAmount;
          regularPriceDiv.innerHTML = priceFormatter(regularPrice);
        } else {
          regularPriceDiv.innerHTML = 'No data';
        }
      }
      if (
        product.masterVariant.prices &&
        product.masterVariant.prices[0] &&
        product.masterVariant.prices[0].discounted
      ) {
        regularPriceDiv.classList.add('crossedOut');
        const discountPriceDiv = createDiv('discountPrice', priceDiv);
        const discountPrice =
          product.masterVariant.prices[0].discounted.value.centAmount;
        discountPriceDiv.innerHTML = `Now ${priceFormatter(discountPrice)}`;
      }
      const detailedInfo = createDiv(styles.detailedInfo, this.container);
      product.masterVariant.attributes?.forEach((attribute) => {
        if (isDescription(attribute.name)) {
          createParagraph(
            styles.detailedDescription,
            attribute.value,
            detailedInfo
          );
        } else if (isSpecification(attribute.name)) {
          createParagraph(styles.specification, attribute.value, detailedInfo);
        }
      });
    }
  }
}
export default ProductPage;
