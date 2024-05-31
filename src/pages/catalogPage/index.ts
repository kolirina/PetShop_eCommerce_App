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
  createLabel,
} from '../../utils/elementCreator';
import {
  fetchProducts,
  fetchFilteredByPriceAndBrand,
  fetchFilteredByPrice,
  fetchFilteredByBrand,
} from '../../api/SDK';
import './catalogPageStyles.css';

class CatalogPage extends Page {
  public banner: HTMLDivElement;

  public categoryBanner: HTMLDivElement;

  public sortSearchPanel: HTMLDivElement;

  public showFiltersButton: HTMLButtonElement;

  public productsContainerPlusAside: HTMLDivElement;

  public productsContainer: HTMLDivElement;

  public aside: HTMLElement;

  public filterByBrandDiv: HTMLDivElement;

  public chosenBrands: string[] = [];

  public filterByPrice: HTMLDivElement;

  public priceRange: HTMLDivElement;

  public minPriceInput: HTMLInputElement;

  public maxPriceInput: HTMLInputElement;

  public filterByPriceTitle: HTMLDivElement;

  public showFilteredByPrice: HTMLButtonElement;

  public minPrice: number = 0;

  public maxPrice: number = 0;

  public productsDisplayed: FilteredProducts = [];

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
    const searchDiv = createDiv('searchDiv', this.sortSearchPanel);
    const searchInput = createInput({
      className: 'searchInput',
      type: 'text',
      placeholder: 'Search on PetShop',
      parentElement: searchDiv,
    });
    searchDiv.appendChild(searchInput);
    const searchButton = createBtn('searchButton', '🔍', searchDiv);
    searchDiv.appendChild(searchButton);
    const sortDiv = createDiv('sort', this.sortSearchPanel);

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
      if (this.chosenBrands.length === 0) {
        filteredProducts = await fetchFilteredByPrice(
          this.minPrice,
          this.maxPrice
        );
        this.getInfoFilteredProducts(filteredProducts);
        this.filterByBrandDiv.innerHTML = '';
        this.getBrandsOfFilteredProducts(filteredProducts);
        this.minPriceInput.classList.add('chosen');
        this.maxPriceInput.classList.add('chosen');
      } else {
        this.chosenBrands.forEach(async (chosenBrand) => {
          if (this.minPrice && this.maxPrice) {
            filteredProducts = await fetchFilteredByPriceAndBrand(
              this.minPrice,
              this.maxPrice,
              chosenBrand
            );
          }

          this.minPriceInput.classList.add('chosen');
          this.maxPriceInput.classList.add('chosen');

          this.getInfoFilteredProducts(filteredProducts);
          this.filterByBrandDiv.innerHTML = '';
          this.getBrandsOfFilteredProducts(filteredProducts);
        });
      }
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
    const productsData = await fetchProducts();
    this.getInfoProducts(productsData);
    this.getBrands(productsData);
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

  public getBrands(products: Products) {
    const brands: string[] = [];
    products.forEach((product: Product) => {
      const brandAttribute =
        product.masterData.current?.masterVariant.attributes?.find(
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
          const filteredProducts = await fetchFilteredByPrice(
            this.minPrice,
            this.maxPrice
          );
          this.getInfoFilteredProducts(filteredProducts);
          this.filterByBrandDiv.innerHTML = '';
          this.getBrandsOfFilteredProducts(filteredProducts);
        }
        try {
          this.chosenBrands.forEach(async (chosenBrand) => {
            let filteredProducts = [];
            if (this.minPrice && this.maxPrice) {
              filteredProducts = await fetchFilteredByPriceAndBrand(
                this.minPrice,
                this.maxPrice,
                chosenBrand
              );
            } else {
              filteredProducts = await fetchFilteredByBrand(chosenBrand);
            }
            this.getInfoFilteredProducts(filteredProducts);
          });
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
  }
}

export default CatalogPage;
