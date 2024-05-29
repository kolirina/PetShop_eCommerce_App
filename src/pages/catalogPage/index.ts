import Router from '../../router';
import Page from '../Page';
import { Product, Products } from '../../types/product';
import { FilteredProduct, FilteredProducts } from '../../types/filterProducts';
import {
  createDiv,
  createImg,
  createAside,
  createInput,
  createBtn,
} from '../../utils/elementCreator';
import { fetchProducts, fetchFilteredByPrice } from '../../api/SDK';
import './catalogPageStyles.css';

class CatalogPage extends Page {
  public banner: HTMLDivElement;

  public categoryBanner: HTMLDivElement;

  public filterSortPanel: HTMLDivElement;

  public productsContainerPlusAside: HTMLDivElement;

  public productsContainer: HTMLDivElement;

  public aside: HTMLElement;

  constructor(router: Router, parentElement: HTMLElement) {
    super(router, parentElement);
    this.container = createDiv('catalogContainer', document.body);
    this.banner = createDiv('banner', this.container);
    this.filterSortPanel = createDiv('filterSortPanel', this.container);
    this.filterSortPanel.innerHTML = '';
    this.categoryBanner = createDiv('categoryBanner', this.container);
    this.productsContainerPlusAside = createDiv(
      'productsContainerPlusAside',
      this.container
    );
    this.aside = createAside('aside', this.productsContainerPlusAside);
    this.productsContainer = createDiv(
      'productsContainer',
      this.productsContainerPlusAside
    );

    this.createAsideContent(this.aside);

    this.fetchProducts();
  }

  public createAsideContent(asideElement: HTMLElement): void {
    const sortDiv = createDiv('sort', asideElement);

    const sortBySelect = document.createElement('select');
    sortBySelect.classList.add('catalogSelect');
    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = 'Sort By';
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    placeholderOption.hidden = true;

    const priceAscOption = document.createElement('option');
    priceAscOption.value = 'price-asc';
    priceAscOption.textContent = 'Price Ascending';

    const priceDescOption = document.createElement('option');
    priceDescOption.value = 'price-desc';
    priceDescOption.textContent = 'Price Descending';

    const nameOption = document.createElement('option');
    nameOption.value = 'name';
    nameOption.textContent = 'Name';

    sortBySelect.appendChild(placeholderOption);
    sortBySelect.appendChild(priceAscOption);
    sortBySelect.appendChild(priceDescOption);
    sortBySelect.appendChild(nameOption);

    sortDiv.appendChild(sortBySelect);

    // sortBySelect.addEventListener('change', this.sortProducts.bind(this));

    const categoriesDiv = createDiv('CatalogAsideTitle', asideElement);
    categoriesDiv.innerHTML = 'Categories';
    const filterByPrice = createDiv('filterByPrice', asideElement);
    const filterByPriceTitle = createDiv('CatalogAsideTitle', filterByPrice);
    filterByPriceTitle.innerHTML = 'Price';
    const priceRange = createDiv('filterByPriceInputWrapper', filterByPrice);
    const minPriceInput = createInput({
      className: 'catalogInput',
      type: 'number',
      isActive: true,
      placeholder: 'from',
      parentElement: priceRange,
    });
    const maxPriceInput = createInput({
      className: 'catalogInput',
      type: 'number',
      isActive: true,
      placeholder: 'to',
      parentElement: priceRange,
    });
    const showFilteredByPrice = createBtn('catalogButton', 'Show', priceRange);
    showFilteredByPrice.addEventListener('click', async () => {
      this.productsContainer.innerHTML = '';
      const minPrice = Number(minPriceInput.value) * 100;
      const maxPrice = Number(maxPriceInput.value) * 100;
      const filteredByPriceProducts = await fetchFilteredByPrice(
        minPrice,
        maxPrice
      );
      this.getInfoFilteredProducts(filteredByPriceProducts);
    });

    const resetBtn = createBtn('catalogButton', 'Reset', this.aside);
    resetBtn.addEventListener('click', () => {
      this.productsContainer.innerHTML = '';
      this.fetchProducts();
    });
  }

  async fetchProducts(): Promise<void> {
    const productsData = await fetchProducts();
    this.getInfoProducts(productsData);
  }

  public getInfoProducts(products: Products) {
    products.forEach((product: Product) => {
      // const { id } = product;

      let name = '';
      if (product.masterData.current?.name?.['en-US']) {
        const productNameString = product.masterData.current?.name?.['en-US'];
        name = productNameString?.toUpperCase();
      }

      const imageSrc =
        product.masterData.current.masterVariant.images?.[0]?.url ||
        '../../assets/placeholder.png';

      const description = product.masterData.current.description
        ? product.masterData.current.description['en-US'] ||
          'Sorry, no description available.'
        : 'Sorry, no description available.';

      let regularPrice = 0;
      if (product.masterData.current.masterVariant.prices) {
        if (product.masterData.current.masterVariant.prices[0].value) {
          regularPrice =
            product.masterData.current.masterVariant.prices[0].value.centAmount;
        }
      }
      let discountedPrice = 0;
      if (
        product.masterData.current.masterVariant.prices &&
        product.masterData.current.masterVariant.prices[0] &&
        product.masterData.current.masterVariant.prices[0].discounted &&
        product.masterData.current.masterVariant.prices[0].discounted.value
          .centAmount
      ) {
        discountedPrice =
          product.masterData.current.masterVariant.prices[0].discounted.value
            .centAmount;
      }

      this.displayProductCard(
        // id,
        name,
        imageSrc,
        description,
        regularPrice,
        discountedPrice
      );
    });
  }

  public getInfoFilteredProducts(filteredProducts: FilteredProducts) {
    filteredProducts.forEach((product: FilteredProduct) => {
      // const { id } = product;

      let name = '';
      if (product.name) {
        const productNameString = product.name?.['en-US'];
        name = productNameString?.toUpperCase();
      }

      const imageSrc =
        product.masterVariant.images?.[0]?.url ||
        '../../assets/placeholder.png';

      const description = product.description
        ? product.description['en-US'] || 'Sorry, no description available.'
        : 'Sorry, no description available.';

      let regularPrice = 0;
      if (product.masterVariant.prices) {
        if (product.masterVariant.prices[0].value) {
          regularPrice = product.masterVariant.prices[0].value.centAmount;
        }
      }
      let discountedPrice = 0;
      if (
        product.masterVariant.prices &&
        product.masterVariant.prices[0] &&
        product.masterVariant.prices[0].discounted
      ) {
        discountedPrice =
          product.masterVariant.prices[0].discounted.value.centAmount;
      }

      this.displayProductCard(
        // id,
        name,
        imageSrc,
        description,
        regularPrice,
        discountedPrice
      );
    });
  }

  public displayProductCard(
    // id: string,
    name: string,
    imageSrc: string,
    description: string,
    regularPrice: number,
    discountedPrice: number
  ) {
    const productCard = createDiv('productCard', this.productsContainer);
    const productImageSrc = imageSrc;
    const productImage = createImg(
      'productImage',
      productImageSrc,
      'Sorry, no image',
      productCard
    );
    productCard.appendChild(productImage);
    const productName = createDiv('productName', productCard);
    const productNameString = name;
    productName.innerHTML = productNameString;
    const productInfoBrief = createDiv('productInfoBrief', productCard);
    const productInfoBriefText = description
      ? description || 'Sorry, no description available.'
      : 'Sorry, no description available.';
    productInfoBrief.innerHTML = productInfoBriefText;
    const priceDiv = createDiv('priceDiv', productCard);
    const regularPriceDiv = createDiv('regularPrice', priceDiv);
    regularPriceDiv.innerHTML = `€${(regularPrice / 100).toFixed(2)}`;

    if (discountedPrice) {
      regularPriceDiv.classList.add('crossedOut');
      const discountPriceDiv = createDiv('discountPrice', priceDiv);
      discountPriceDiv.innerHTML = `Now €${(discountedPrice / 100).toFixed(2)}`;
    }
  }
}

export default CatalogPage;
