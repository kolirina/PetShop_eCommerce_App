import { getProduct } from '../../api/SDK';
import Router from '../../router';
import {
  createBtn,
  createDiv,
  createImg,
  createList,
  createListElement,
  createParagraph,
  createSpan,
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
        const img = createImg(
          styles.productImage,
          image.url,
          'product',
          this.carousel
        );
        img.addEventListener('click', () => this.openModal(image.url));
      });
      if (this.carousel.childElementCount > 1) {
        const prevButton = createBtn(
          styles.carouselButton,
          '<',
          imageContainer
        );
        prevButton.classList.add(styles.prevButton);
        prevButton.addEventListener('click', () => this.moveCarousel(-1));
        const nextButton = createBtn(
          styles.carouselButton,
          '>',
          imageContainer
        );
        nextButton.classList.add(styles.nextButton);
        nextButton.addEventListener('click', () => this.moveCarousel(1));
      }

      const infoContainer = createDiv(styles.infoContainer, baseInfo);
      createParagraph(styles.productName, product.name['en-US'], infoContainer);
      const shortDescription =
        product.description!['en-US'] ?? 'No description available';
      createParagraph(styles.shortDescription, shortDescription, infoContainer);

      const priceDiv = createDiv(styles.priceDiv, infoContainer);
      const regularPriceDiv = createDiv(styles.regularPrice, priceDiv);
      if (product.masterVariant.prices) {
        if (product.masterVariant.prices[0].value) {
          const regularPrice = product.masterVariant.prices[0].value.centAmount;
          regularPriceDiv.textContent = priceFormatter(regularPrice);
        } else {
          regularPriceDiv.textContent = 'Error when price fetching';
        }
      }
      if (
        product.masterVariant.prices &&
        product.masterVariant.prices[0] &&
        product.masterVariant.prices[0].discounted
      ) {
        regularPriceDiv.classList.add(styles.crossedOut);
        const discountPriceDiv = createDiv(styles.discountPrice, priceDiv);
        const discountPrice =
          product.masterVariant.prices[0].discounted.value.centAmount;
        discountPriceDiv.textContent = `Now ${priceFormatter(discountPrice)}`;
      }

      const detailedInfo = createDiv(styles.detailedInfo, this.container);
      product.masterVariant.attributes?.forEach((attribute) => {
        if (isDescription(attribute.name)) {
          const description = createDiv(styles.description);
          createParagraph(styles.title, 'Description:', description);
          createParagraph(
            styles.detailedDescription,
            attribute.value,
            description
          );
          detailedInfo.prepend(description);
        } else if (isSpecification(attribute.name)) {
          createParagraph(styles.title, 'Specifications:', detailedInfo);
          const specsList = createList(styles.specsList);
          attribute.value
            .split('\n')
            .forEach((spec: string, index: number) =>
              index === 0
                ? createParagraph(styles.spec, spec, detailedInfo)
                : createListElement(styles.spec, spec, specsList)
            );
          detailedInfo.append(specsList);
        }
      });
    }
  }

  openModal(imageUrl: string) {
    const modal = createDiv(styles.modal, document.body);
    const modalContent = createDiv(styles.modalContent, modal);
    createImg(styles.modalImage, imageUrl, 'enlarged image', modalContent);
    const closeButton = createSpan(styles.closeButton, '×', modalContent);
    closeButton.addEventListener('click', () => {
      modal.remove();
      // delete this
      this.carousel = createDiv(styles.delete);
    });
  }
}
export default ProductPage;
