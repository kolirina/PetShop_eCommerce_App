import { fetchProducts } from '../../api/SDK';

import { createDiv, createImg } from '../../utils/elementCreator';
import priceFormatter from '../../utils/priceFormatter';

import { Eng } from './constants';

import Router from '../../router';
import Page from '../Page';

import './catalogPageStyles.css';

class CatalogPage extends Page {
  public banner: HTMLDivElement;

  public categoryBanner: HTMLDivElement;

  public filterSortPanel: HTMLDivElement;

  public productsContainer: HTMLDivElement;

  constructor(router: Router, parentElement: HTMLElement) {
    super(router, parentElement);
    this.container = createDiv('catalogContainer', document.body);
    this.banner = createDiv('banner', this.container);
    this.filterSortPanel = createDiv('filterSortPanel', this.container);
    this.filterSortPanel.innerHTML = 'Filter and sort here.';
    this.categoryBanner = createDiv('categoryBanner', this.container);
    this.productsContainer = createDiv('productsContainer', this.container);

    this.fetchAndDisplayProducts();
  }

  async fetchAndDisplayProducts(): Promise<void> {
    const productsData = await fetchProducts();
    productsData.forEach((product) => {
      const productCard = createDiv('productCard', this.productsContainer);
      const productImageSrc =
        product.masterData.current.masterVariant.images?.[0]?.url ||
        '../../assets/placeholder.png';
      const productImage = createImg(
        'productImage',
        productImageSrc,
        'Sorry, no image',
        productCard
      );
      productCard.appendChild(productImage);
      const productName = createDiv('productName', productCard);
      productName.innerHTML =
        product.masterData.current.name[Eng].toUpperCase();
      const productInfoBrief = createDiv('productInfoBrief', productCard);
      const productInfoBriefText = product.masterData.current.description
        ? product.masterData.current.description[Eng] ||
          'Sorry, no description available.'
        : 'Sorry, no description available.';
      productInfoBrief.innerHTML = productInfoBriefText;
      const priceDiv = createDiv('priceDiv', productCard);
      const regularPriceDiv = createDiv('regularPrice', priceDiv);
      if (product.masterData.current.masterVariant.prices) {
        if (product.masterData.current.masterVariant.prices[0].value) {
          const regularPrice =
            product.masterData.current.masterVariant.prices[0].value.centAmount;
          regularPriceDiv.innerHTML = priceFormatter(regularPrice);
        } else {
          regularPriceDiv.innerHTML = 'No data';
        }
      }
      if (
        product.masterData.current.masterVariant.prices &&
        product.masterData.current.masterVariant.prices[0] &&
        product.masterData.current.masterVariant.prices[0].discounted
      ) {
        regularPriceDiv.classList.add('crossedOut');
        const discountPriceDiv = createDiv('discountPrice', priceDiv);
        const discountPrice =
          product.masterData.current.masterVariant.prices[0].discounted.value
            .centAmount;
        discountPriceDiv.innerHTML = priceFormatter(discountPrice);
      }
    });
  }
}
export default CatalogPage;
