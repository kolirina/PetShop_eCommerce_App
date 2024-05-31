import Router from '../../router';
import Page from '../Page';
import SortBy from '../../types/sortBy';
import { FilteredProduct, FilteredProducts } from '../../types/filterProducts';
import {
  createDiv,
  createImg,
  createAside,
  createInput,
  createBtn,
  createLabel,
} from '../../utils/elementCreator';
import {
  fetchProducts,
  fetchFilteredByPriceAndBrandAndSearch,
  getSearchResult,
} from '../../api/SDK';
import './catalogPageStyles.css';

class CatalogPage extends Page {
  public banner: HTMLDivElement;

  public categoryBanner: HTMLDivElement;

  public sortSearchPanel: HTMLDivElement;

  public showFiltersButton: HTMLButtonElement;

  public searchDiv: HTMLDivElement;

  public searchInput: HTMLInputElement;

  public searchButton: HTMLButtonElement;

  public productsContainerPlusAside: HTMLDivElement;

  public productsContainer: HTMLDivElement;

  public aside: HTMLElement;

  public filterByBrandDiv: HTMLDivElement;

  public filterByPrice: HTMLDivElement;

  public priceRange: HTMLDivElement;

  public minPriceInput: HTMLInputElement;

  public maxPriceInput: HTMLInputElement;

  public filterByPriceTitle: HTMLDivElement;

  public showFilteredByPrice: HTMLButtonElement;

  public productsDisplayed: FilteredProducts = [];

  public minPrice: number = 0;

  public maxPrice: number = 0;

  public chosenBrands: string[] = [];

  public searchWord: string = '';

  public sortBy: SortBy = SortBy.PRICE_ASC;

  constructor(router: Router, parentElement: HTMLElement) {
    super(router, parentElement);
    this.container = createDiv('catalogContainer', document.body);
    this.banner = createDiv('banner', this.container);
    this.sortSearchPanel = createDiv('sortSearchPanel', this.container);
    this.showFiltersButton = createBtn(
      'catalogButton',
      'Show Filters',
      this.sortSearchPanel
    );
    this.showFiltersButton.classList.add('showFiltersButton');
    this.showFiltersButton.addEventListener('click', () => {
      this.aside.classList.toggle('visible');
      if (this.aside.classList.contains('visible')) {
        this.showFiltersButton.textContent = 'Hide Filters';
      } else {
        this.showFiltersButton.textContent = 'Show Filters';
      }
    });
    this.searchDiv = createDiv('searchDiv', this.sortSearchPanel);
    this.searchInput = createInput({
      className: 'searchInput',
      type: 'text',
      placeholder: 'Search on PetShop',
      parentElement: this.searchDiv,
    });
    this.searchDiv.appendChild(this.searchInput);
    this.searchButton = createBtn('searchButton', '🔍', this.searchDiv);
    this.searchButton.addEventListener('click', async () => {
      this.searchWord = this.searchInput.value;
      this.productsContainer.innerHTML = '';
      this.productsDisplayed = [];
      this.minPriceInput.value = '';
      this.maxPriceInput.value = '';
      this.minPriceInput.classList.remove('chosen');
      this.maxPriceInput.classList.remove('chosen');
      this.filterByBrandDiv.innerHTML = '';
      this.chosenBrands = [];
      this.minPrice = 0;
      this.maxPrice = 0;
      const searchResult = await getSearchResult(
        this.searchInput.value,
        this.sortBy
      );

      this.getInfoFilteredProducts(searchResult);
      this.getBrandsOfFilteredProducts(searchResult);
    });

    const sortDiv = createDiv('sort', this.sortSearchPanel);
    const sortBySelect = document.createElement('select');
    sortBySelect.classList.add('catalogSelect');

    const priceAscOption = document.createElement('option');
    priceAscOption.value = SortBy.PRICE_ASC;
    priceAscOption.textContent = 'Price Ascending';

    const priceDescOption = document.createElement('option');
    priceDescOption.value = SortBy.PRICE_DESC;
    priceDescOption.textContent = 'Price Descending';

    const nameOption = document.createElement('option');
    nameOption.value = SortBy.NAME_ASC;
    nameOption.textContent = 'Name A-Z';

    sortBySelect.appendChild(priceAscOption);
    sortBySelect.appendChild(priceDescOption);
    sortBySelect.appendChild(nameOption);

    sortBySelect.value = SortBy.PRICE_ASC;

    sortDiv.appendChild(sortBySelect);

    sortBySelect.addEventListener('change', async () => {
      this.sortBy = sortBySelect.value as SortBy;
      this.productsContainer.innerHTML = '';
      const filteredProducts = await fetchFilteredByPriceAndBrandAndSearch(
        this.minPrice,
        this.maxPrice,
        this.chosenBrands,
        this.searchWord,
        this.sortBy
      );
      this.getInfoFilteredProducts(filteredProducts);
      this.filterByBrandDiv.innerHTML = '';
      this.getBrandsOfFilteredProducts(filteredProducts);
    });

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
    this.filterByPrice = createDiv('filterByPrice', this.aside);

    this.filterByPriceTitle = createDiv(
      'CatalogAsideTitle',
      this.filterByPrice
    );
    this.filterByPriceTitle.innerHTML = 'Price, €';

    this.priceRange = createDiv(
      'filterByPriceInputWrapper',
      this.filterByPrice
    );
    this.minPriceInput = createInput({
      className: 'catalogInput',
      type: 'number',
      isActive: true,
      placeholder: 'from',
      parentElement: this.priceRange,
    });
    this.maxPriceInput = createInput({
      className: 'catalogInput',
      type: 'number',
      isActive: true,
      placeholder: 'to',
      parentElement: this.priceRange,
    });

    this.showFilteredByPrice = createBtn(
      'catalogButton',
      'Show',
      this.priceRange
    );
    this.showFilteredByPrice.addEventListener('click', async () => {
      if (this.aside.classList.contains('visible')) {
        this.aside.classList.remove('visible');
        this.showFiltersButton.textContent = 'Show Filters';
      }
      this.productsContainer.innerHTML = '';
      this.productsDisplayed = [];
      this.minPrice = Number(this.minPriceInput.value) * 100;
      this.maxPrice = Number(this.maxPriceInput.value) * 100;
      let filteredProducts: FilteredProduct[] = [];

      filteredProducts = await fetchFilteredByPriceAndBrandAndSearch(
        this.minPrice,
        this.maxPrice,
        this.chosenBrands,
        this.searchWord,
        this.sortBy
      );
      this.filterByBrandDiv.innerHTML = '';
      this.getInfoFilteredProducts(filteredProducts);
      this.getBrandsOfFilteredProducts(filteredProducts);
      this.minPriceInput.classList.add('chosen');
      this.maxPriceInput.classList.add('chosen');
    });
    this.filterByBrandDiv = createDiv('filterByBrandDiv', this.aside);

    this.fetchProducts();
  }

  public createAsideContent(asideElement: HTMLElement): void {
    const resetBtn = createBtn(
      'catalogButton',
      'Reset all filters',
      this.aside
    );
    resetBtn.addEventListener('click', () => this.reset());
    const categoriesDiv = createDiv('CatalogAsideTitle', asideElement);
    categoriesDiv.innerHTML = 'Categories';
  }

  async fetchProducts(): Promise<void> {
    const productsData = await fetchProducts(this.sortBy);
    this.getInfoFilteredProducts(productsData);
    this.getBrandsOfFilteredProducts(productsData);
  }

  public getInfoFilteredProducts(filteredProducts: FilteredProducts) {
    this.productsDisplayed = filteredProducts;
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

  public getBrandsOfFilteredProducts(products: FilteredProducts) {
    const brands: string[] = [];
    products.forEach((product: FilteredProduct) => {
      const brandAttribute = product.masterVariant.attributes?.find(
        (attr) => attr.name === 'brand'
      );
      const brandName: { [key: string]: string } | undefined =
        brandAttribute?.value;
      if (typeof brandName === 'string') {
        brands.push(brandName);
      }
    });
    this.createBrandAndCountArray(brands);
  }

  public createBrandAndCountArray(brands: string[]) {
    const brandCount: { [key: string]: number } = {};
    for (let i = 0; i < brands.length; i += 1) {
      const brand = brands[i];
      if (brandCount[brand]) {
        brandCount[brand] += 1;
      } else {
        brandCount[brand] = 1;
      }
    }
    const uniqueBrandsAndCounts = Object.keys(brandCount).map((key) => {
      return { brand: key, count: brandCount[key] };
    });
    const uniqueBrandsAndCountsSorted = uniqueBrandsAndCounts.sort((a, b) =>
      a.brand.localeCompare(b.brand)
    );
    this.createBrandCheckboxes(uniqueBrandsAndCountsSorted);
    return uniqueBrandsAndCounts;
  }

  public createBrandCheckboxes(
    brands: { brand: string; count: number }[]
  ): void {
    const filterByBrandTitle = createDiv(
      'CatalogAsideTitle',
      this.filterByBrandDiv
    );
    filterByBrandTitle.innerHTML = 'Brand';
    brands.forEach((brand) => {
      const checkbox = createInput({
        className: 'checkbox',
        type: 'checkbox',
        parentElement: this.filterByBrandDiv,
      });
      checkbox.value = brand.brand;
      checkbox.name = 'brands';
      if (this.chosenBrands.includes(brand.brand)) {
        checkbox.checked = true;
      }

      const label = createLabel('label', `${brand.brand} (${brand.count})`);
      this.filterByBrandDiv.appendChild(label);
      this.filterByBrandDiv.appendChild(document.createElement('br'));
      checkbox.addEventListener('click', async () => {
        this.productsContainer.innerHTML = '';
        if (!this.chosenBrands.includes(brand.brand)) {
          this.chosenBrands.push(brand.brand);
        } else {
          const index = this.chosenBrands.indexOf(brand.brand);
          if (index > -1) {
            this.chosenBrands.splice(index, 1);
          }
        }
        if (this.chosenBrands.length === 0) {
          const filteredProducts = await fetchFilteredByPriceAndBrandAndSearch(
            this.minPrice,
            this.maxPrice,
            this.chosenBrands,
            this.searchWord,
            this.sortBy
          );
          this.getInfoFilteredProducts(filteredProducts);
          this.filterByBrandDiv.innerHTML = '';
          this.getBrandsOfFilteredProducts(filteredProducts);
        }
        if (
          !this.minPrice &&
          !this.maxPrice &&
          this.chosenBrands.length === 0 &&
          !this.searchWord
        ) {
          this.reset();
        }

        try {
          const filteredProducts = await fetchFilteredByPriceAndBrandAndSearch(
            this.minPrice,
            this.maxPrice,
            this.chosenBrands,
            this.searchWord,
            this.sortBy
          );
          this.getInfoFilteredProducts(filteredProducts);
        } catch (error) {
          throw new Error('Error fetching filtered products');
        }
      });
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

  public reset() {
    this.productsContainer.innerHTML = '';
    this.fetchProducts();
    this.minPriceInput.value = '';
    this.maxPriceInput.value = '';
    this.minPriceInput.classList.remove('chosen');
    this.maxPriceInput.classList.remove('chosen');
    this.filterByBrandDiv.innerHTML = '';
    this.chosenBrands = [];
    this.minPrice = 0;
    this.maxPrice = 0;
    this.searchInput.value = '';
    this.searchWord = '';
  }
}

export default CatalogPage;
