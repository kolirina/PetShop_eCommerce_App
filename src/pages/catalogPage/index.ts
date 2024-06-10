import { LineItem } from '@commercetools/platform-sdk';
import Router from '../../router';
import Page from '../Page';
import SortBy from '../../types/sortBy';
import Category from '../../types/category';
import { FilteredProduct, FilteredProducts } from '../../types/filterProducts';
import { lang } from '../../constants';
import { createAnonymousUser } from '../../api/services';
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
  getCategories,
  createAnonymousCart,
  createCart,
  addToCart,
  getCartById,
} from '../../api/SDK';
import priceFormatter from '../../utils/priceFormatter';
import Pages from '../../router/pageNames';
import './catalogPageStyles.css';

class CatalogPage extends Page {
  public banner: HTMLDivElement;

  public categoryBanner: HTMLDivElement;

  public sortSearchPanel: HTMLDivElement;

  public breadcrumbsContainer: HTMLDivElement;

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

  public categoriesDiv: HTMLDivElement;

  public minPrice: number = 0;

  public maxPrice: number = 0;

  public chosenBrands: string[] = [];

  public searchWord: string = '';

  public categoryId: string = '';

  public sortBy: SortBy = SortBy.PRICE_ASC;

  public productsInCartIds: string[] = [];

  constructor(router: Router, parentElement: HTMLElement) {
    super(router, parentElement);
    this.container = createDiv('catalogContainer', document.body);
    this.banner = createDiv('banner', this.container);
    this.categoryBanner = createDiv('categoryBanner', this.container);
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

    this.productsContainerPlusAside = createDiv(
      'productsContainerPlusAside',
      this.container
    );
    this.breadcrumbsContainer = createDiv(
      'breadcrumbsContainer',
      this.categoryBanner
    );
    this.breadcrumbsContainer.innerHTML = 'Home';
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
      if (this.searchInput.value) {
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
        this.categoryId = '';
        this.breadcrumbsContainer.innerHTML = 'HOME';
        document.querySelectorAll('.chosenCategory').forEach((el) => {
          el.classList.remove('chosenCategory');
        });
        const searchResult = await getSearchResult(
          this.searchInput.value,
          this.sortBy
        );

        this.getInfoFilteredProducts(searchResult);
        this.getBrandsOfFilteredProducts(searchResult);
      }
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
        this.sortBy,
        this.categoryId
      );
      this.getInfoFilteredProducts(filteredProducts);
      this.filterByBrandDiv.innerHTML = '';
      this.getBrandsOfFilteredProducts(filteredProducts);
    });

    this.aside = createAside('aside', this.productsContainerPlusAside);
    this.productsContainer = createDiv(
      'productsContainer',
      this.productsContainerPlusAside
    );

    this.createAsideContent(this.aside);

    this.categoriesDiv = createDiv('categoriesDiv', this.aside);
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
      if (!this.minPrice) {
        this.minPrice = 1;
      }
      if (!this.maxPrice) {
        this.maxPrice = 999 * 100;
      }
      let filteredProducts: FilteredProduct[] = [];

      filteredProducts = await fetchFilteredByPriceAndBrandAndSearch(
        this.minPrice,
        this.maxPrice,
        this.chosenBrands,
        this.searchWord,
        this.sortBy,
        this.categoryId
      );
      this.filterByBrandDiv.innerHTML = '';
      this.getInfoFilteredProducts(filteredProducts);
      this.getBrandsOfFilteredProducts(filteredProducts);
      this.minPriceInput.classList.add('chosen');
      this.maxPriceInput.classList.add('chosen');
    });
    this.filterByBrandDiv = createDiv('filterByBrandDiv', this.aside);

    this.fetchProducts();
    this.getCategories();
  }

  public createAsideContent(asideElement: HTMLElement): void {
    const resetBtn = createBtn(
      'catalogButton',
      'Reset all filters',
      this.aside
    );
    resetBtn.addEventListener('click', () => this.reset());
    const categoriesDivTitle = createDiv('CatalogAsideTitle', asideElement);
    categoriesDivTitle.innerHTML = 'Categories';
  }

  async fetchProducts(): Promise<void> {
    const productsData = await fetchProducts(this.sortBy);
    this.getInfoFilteredProducts(productsData);
    this.getBrandsOfFilteredProducts(productsData);
    this.breadcrumbsContainer.innerHTML = 'HOME';
  }

  public async getInfoFilteredProducts(filteredProducts: FilteredProducts) {
    if (filteredProducts.length === 0) {
      this.productsContainer.innerHTML =
        'It seems that no product matches your request. Please try again.';
    }
    this.productsDisplayed = filteredProducts;
    let cartId;
    if (localStorage.getItem('registered_user_cart_id')) {
      cartId = localStorage.getItem('registered_user_cart_id')!;
    }
    if (
      !localStorage.getItem('registered_user_cart_id') &&
      localStorage.getItem('anonymous_cart_id')
    ) {
      cartId = localStorage.getItem('anonymous_cart_id')!;
    }
    if (cartId) {
      const cart = await getCartById(cartId);
      const productsInCart = cart.body.lineItems;
      this.productsInCartIds = [];
      if (productsInCart) {
        productsInCart.forEach((product: LineItem) =>
          this.productsInCartIds.push(product.productId)
        );
      }
    }

    filteredProducts.forEach((product: FilteredProduct) => {
      const { id } = { id: product.id };

      let name = '';
      if (product.name) {
        const productNameString = product.name?.[lang];
        name = productNameString?.toUpperCase();
      }

      const imageSrc =
        product.masterVariant.images?.[0]?.url ||
        '../../assets/placeholder.png';

      const description =
        product.description?.[lang] || 'Sorry, no description available.';

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
        { id },
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
      const label = createLabel('label', `${brand.brand} (${brand.count})`);
      this.filterByBrandDiv.appendChild(label);
      const checkbox = createInput({
        className: 'checkbox',
        type: 'checkbox',
        parentElement: label,
      });
      checkbox.value = brand.brand;
      checkbox.name = 'brands';
      if (this.chosenBrands.includes(brand.brand)) {
        checkbox.checked = true;
      }

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
            this.sortBy,
            this.categoryId
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
            this.sortBy,
            this.categoryId
          );
          this.getInfoFilteredProducts(filteredProducts);
        } catch (error) {
          throw new Error('Error fetching filtered products');
        }
      });
    });
  }

  public displayProductCard(
    { id }: { id: FilteredProduct['id'] },
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
    const productInfoBriefText =
      description || 'Sorry, no description available.';
    productInfoBrief.innerHTML = productInfoBriefText;
    const priceAndAddToCart = createDiv('priceAndAddToCart', productCard);
    const priceDiv = createDiv('priceDiv', priceAndAddToCart);
    const regularPriceDiv = createDiv('regularPrice', priceDiv);
    regularPriceDiv.innerHTML = `${priceFormatter(regularPrice)}`;

    if (discountedPrice) {
      regularPriceDiv.classList.add('crossedOut');
      const discountPriceDiv = createDiv('discountPrice', priceDiv);
      discountPriceDiv.innerHTML = `Now ${priceFormatter(discountedPrice)}`;
    }

    const addToCartButton = createBtn(
      'catalogButton',
      'ADD TO CART',
      priceAndAddToCart
    );
    addToCartButton.classList.add('addToCartButton');
    productCard.addEventListener('click', () =>
      this.router.navigateTo(Pages.PRODUCT, { id })
    );
    if (this.productsInCartIds.includes(id)) {
      addToCartButton.classList.add('alreadyInCart');
      addToCartButton.disabled = true;
      addToCartButton.innerText = 'ALREADY IN CART';
    }
    addToCartButton.addEventListener('click', async (event) => {
      event.stopPropagation();
      addToCartButton.classList.add('alreadyInCart');
      addToCartButton.disabled = true;
      addToCartButton.innerText = 'ALREADY IN CART';

      if (
        !localStorage.getItem('token') &&
        !localStorage.getItem('id') &&
        !localStorage.getItem('anonymous_token')
      ) {
        await createAnonymousUser();
        await createAnonymousCart();
      }
      if (
        !localStorage.getItem('registered_user_cart_id') &&
        localStorage.getItem('id')
      ) {
        const customerId = localStorage.getItem('id');
        if (customerId) {
          await createCart(customerId);
        }
      }
      let cartVersion = '';
      if (localStorage.getItem('registered_user_cart_version')) {
        cartVersion = localStorage.getItem('registered_user_cart_version')!;
      } else {
        cartVersion = localStorage.getItem('anonymous_cart_version')!;
      }
      await addToCart(id, 1, JSON.parse(cartVersion));
      try {
        const filteredProducts = await fetchFilteredByPriceAndBrandAndSearch(
          this.minPrice,
          this.maxPrice,
          this.chosenBrands,
          this.searchWord,
          this.sortBy,
          this.categoryId
        );
        this.productsContainer.innerHTML = '';
        this.getInfoFilteredProducts(filteredProducts);
      } catch (error) {
        throw new Error('Error fetching filtered products');
      }
    });
  }

  public async buildBreadcrumb(category: Category) {
    this.breadcrumbsContainer.innerHTML = '';
    this.productsContainer.innerHTML = '';
    const categories = await getCategories();
    const homeBreadcrumb = document.createElement('span');
    homeBreadcrumb.classList.add('breadcrumb');
    homeBreadcrumb.textContent = 'HOME';
    this.breadcrumbsContainer.appendChild(homeBreadcrumb);
    homeBreadcrumb.addEventListener('click', async () => {
      this.categoryId = '';
      const filteredProducts = await fetchFilteredByPriceAndBrandAndSearch(
        this.minPrice,
        this.maxPrice,
        this.chosenBrands,
        this.searchWord,
        this.sortBy,
        this.categoryId
      );
      this.breadcrumbsContainer.innerHTML = 'HOME';
      this.productsContainer.innerHTML = '';
      this.filterByBrandDiv.innerHTML = '';
      this.getInfoFilteredProducts(filteredProducts);
      this.getBrandsOfFilteredProducts(filteredProducts);
      this.getCategories();
    });

    const buildBreadcrumbRecursive = (cat: Category) => {
      if (!cat) return;

      if (cat.parent) {
        const parentCategory = categories.find(
          (parent) => parent.id === cat.parent!.id
        );
        if (parentCategory) {
          buildBreadcrumbRecursive(parentCategory);
        } else {
          return;
        }
      }

      const breadcrumb = document.createElement('span');
      breadcrumb.classList.add('breadcrumb');
      if (cat.name) {
        breadcrumb.textContent = ` - ${cat.name[lang].toUpperCase()}` || 'HOME';
      }

      this.breadcrumbsContainer.appendChild(breadcrumb);
      breadcrumb.addEventListener('click', async () => {
        this.categoryId = cat.id;

        const filteredProducts = await fetchFilteredByPriceAndBrandAndSearch(
          this.minPrice,
          this.maxPrice,
          this.chosenBrands,
          this.searchWord,
          this.sortBy,
          this.categoryId
        );
        this.buildBreadcrumb(cat);
        this.getInfoFilteredProducts(filteredProducts);
        this.filterByBrandDiv.innerHTML = '';
        this.getBrandsOfFilteredProducts(filteredProducts);
        this.getCategories();
      });
    };

    buildBreadcrumbRecursive(category);
  }

  public async getCategories() {
    const categories = await getCategories();
    this.buildHierarchy(categories);
  }

  public async buildHierarchy(
    categories: Category[],
    parentElement: HTMLElement | null = null,
    processedCategories: Set<string> = new Set(),
    level: number = 0
  ) {
    this.categoriesDiv.innerHTML = '';
    const addCategoryToParent = (
      category: Category,
      parentElem: HTMLElement | null,
      lvl: number
    ): HTMLElement => {
      let marginLeft = `${lvl * 20}px`;

      if (category.ancestors && category.ancestors.length > 0) {
        marginLeft = `${(category.ancestors.length + 1) * 9}px`;
      }

      const categoryElem = createDiv('category');
      categoryElem.textContent = category.name![lang];
      categoryElem.style.marginLeft = marginLeft;
      categoryElem.setAttribute('data-category-id', category.id);

      if (category.id === this.categoryId) {
        categoryElem.classList.add('chosenCategory');
      }

      if (parentElem) {
        parentElem.appendChild(categoryElem);
      } else {
        this.categoriesDiv.appendChild(categoryElem);
      }

      categoryElem.addEventListener('click', async (event) => {
        if (this.categoryId === category.id) {
          event.stopPropagation();
          this.breadcrumbsContainer.innerHTML = 'HOME';
          categoryElem.classList.remove('chosenCategory');
          this.productsContainer.innerHTML = '';
          this.categoryId = '';
          const filteredProducts = await fetchFilteredByPriceAndBrandAndSearch(
            this.minPrice,
            this.maxPrice,
            this.chosenBrands,
            this.searchWord,
            this.sortBy,
            this.categoryId
          );
          this.getInfoFilteredProducts(filteredProducts);
          this.filterByBrandDiv.innerHTML = '';
          this.getBrandsOfFilteredProducts(filteredProducts);
        } else {
          event.stopPropagation();
          this.productsContainer.innerHTML = '';
          document.querySelectorAll('.chosenCategory').forEach((el) => {
            el.classList.remove('chosenCategory');
          });
          categoryElem.classList.add('chosenCategory');
          this.categoryId = category.id;
          const filteredProducts = await fetchFilteredByPriceAndBrandAndSearch(
            this.minPrice,
            this.maxPrice,
            this.chosenBrands,
            this.searchWord,
            this.sortBy,
            this.categoryId
          );
          this.buildBreadcrumb(category);
          this.getInfoFilteredProducts(filteredProducts);
          this.filterByBrandDiv.innerHTML = '';
          this.getBrandsOfFilteredProducts(filteredProducts);
        }
      });

      return categoryElem;
    };

    const buildSubcategories = (
      parentCategory: Category,
      parentElem: HTMLElement,
      lvl: number
    ) => {
      categories.forEach((category) => {
        if (!processedCategories.has(category.id)) {
          const isDirectChild = category.parent?.id === parentCategory.id;

          if (isDirectChild) {
            const childElem = addCategoryToParent(
              category,
              parentElem,
              lvl + 1
            );
            processedCategories.add(category.id);
            buildSubcategories(category, childElem, lvl + 1);
          }
        }
      });
    };
    categories.forEach((category) => {
      if (!processedCategories.has(category.id)) {
        const isTopLevelCategory =
          !category.parent &&
          (!category.ancestors || category.ancestors.length === 0);
        if (isTopLevelCategory) {
          const topElem = addCategoryToParent(category, parentElement, level);
          processedCategories.add(category.id);
          buildSubcategories(category, topElem, level + 1);
        }
      }
    });
    categories.forEach((category) => {
      if (!processedCategories.has(category.id)) {
        if (category.parent) {
          const parentId = category.parent.id;
          const parentElem = document.querySelector(
            `[data-category-id="${parentId}"]`
          ) as HTMLElement;
          if (parentElem) {
            const childElem = addCategoryToParent(
              category,
              parentElem,
              level + 1
            );
            processedCategories.add(category.id);
            buildSubcategories(category, childElem, level + 1);
          }
        }
      }
    });
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
    document.querySelectorAll('.chosenCategory').forEach((el) => {
      el.classList.remove('chosenCategory');
    });
    this.categoryId = '';
  }
}

export default CatalogPage;
