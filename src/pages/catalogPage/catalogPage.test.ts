import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import CatalogPage from '.';
import Router from '../../router';
import TemplatePage from '../templatePage';
import { FilteredProducts } from '../../types/filterProducts';

describe('CatalogPage', () => {
  let catalogPage: CatalogPage;
  let dom: JSDOM;
  let container: HTMLElement;
  let router: Router;
  let templatePage: TemplatePage;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
      url: 'http://localhost',
    });

    global.window = dom.window as unknown as Window & typeof globalThis;
    global.document = dom.window.document;

    const localStorageMock: Record<string, string> = {};
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: (key: string): string | null => {
          return localStorageMock[key] || null;
        },
        setItem: (key: string, value: string): void => {
          localStorageMock[key] = value;
        },
        removeItem: (key: string): void => {
          delete localStorageMock[key];
        },
        clear: (): void => {
          Object.keys(localStorageMock).forEach((key) => {
            delete localStorageMock[key];
          });
        },
      },
      writable: true,
    });

    router = { navigateTo: vi.fn() } as unknown as Router;
    templatePage = {
      getMainElement: vi.fn(() => document.createElement('div')),
      getHeader: vi.fn(() => ({ updateHeader: vi.fn() })),
    } as unknown as TemplatePage;

    container = document.createElement('div');
    document.body.appendChild(container);
    catalogPage = new CatalogPage(router, templatePage);
    catalogPage.showFiltersButton = document.createElement('button');
    catalogPage.showFiltersButton.classList.add(
      'catalogButton',
      'showFiltersButton'
    );
    catalogPage.showFiltersButton.textContent = 'Show Filters';
    catalogPage.sortSearchPanel.appendChild(catalogPage.showFiltersButton);
    catalogPage.showFiltersButton.addEventListener('click', () => {
      catalogPage.aside.classList.toggle('visible');
      if (catalogPage.aside.classList.contains('visible')) {
        catalogPage.showFiltersButton.textContent = 'Hide Filters';
      } else {
        catalogPage.showFiltersButton.textContent = 'Show Filters';
      }
    });
    catalogPage.render();
  });

  it('should reset catalog page state correctly', () => {
    catalogPage.pageNumber = 1;
    catalogPage.minPrice = 50;
    catalogPage.maxPrice = 100;
    catalogPage.searchInput.value = 'test';
    catalogPage.chosenBrands = ['Brand1', 'Brand2'];

    const mockCategoryElement = document.createElement('div');
    mockCategoryElement.classList.add('chosenCategory');
    container.appendChild(mockCategoryElement);

    catalogPage.reset();

    expect(catalogPage.productsContainer.innerHTML).toBe('');
    expect(catalogPage.pageNumber).toBe(0);
    expect(catalogPage.minPriceInput.value).toBe('');
    expect(catalogPage.maxPriceInput.value).toBe('');
    expect(catalogPage.minPriceInput.classList.contains('chosen')).toBe(false);
    expect(catalogPage.maxPriceInput.classList.contains('chosen')).toBe(false);
    expect(catalogPage.filterByBrandDiv.innerHTML).toBe('');
    expect(catalogPage.chosenBrands).toEqual([]);
    expect(catalogPage.minPrice).toBe(0);
    expect(catalogPage.maxPrice).toBe(0);
    expect(catalogPage.searchInput.value).toBe('');
    expect(catalogPage.searchWord).toBe('');
    const chosenCategoryElements =
      container.querySelectorAll('.chosenCategory');
    expect(chosenCategoryElements.length).toBe(0);
    expect(catalogPage.loadMoreButton.classList.contains('hidden')).toBe(false);
  });

  it('should display message when no products match the filter', async () => {
    const filteredProducts: FilteredProducts = [];

    await catalogPage.getInfoFilteredProducts(filteredProducts);

    expect(catalogPage.productsContainer.innerHTML).toBe(
      'It seems that no product matches your request. Please try again.'
    );
  });

  it('should display products correctly', async () => {
    const filteredProducts: FilteredProducts = [
      {
        id: '1',
        name: { en: 'Product 1' },
        masterVariant: {
          id: 1,
          images: [
            {
              url: 'image1.jpg',
              dimensions: {
                w: 100,
                h: 100,
              },
            },
          ],
          prices: [
            {
              id: 'price1',
              value: {
                type: 'centPrecision',
                currencyCode: 'EUR',
                centAmount: 1000,
                fractionDigits: 2,
              },
              discounted: {
                value: {
                  type: 'centPrecision',
                  currencyCode: 'EUR',
                  centAmount: 800,
                  fractionDigits: 2,
                },
                discount: {
                  typeId: 'discount',
                  id: 'discountId',
                },
              },
            },
          ],
        },
        categories: [],
        createdAt: '2024-01-01T00:00:00.000Z',
        lastModifiedAt: '2024-01-01T00:00:00.000Z',
        productType: {
          typeId: 'productType',
          id: 'productTypeId',
        },
        slug: { en: 'product-1' },
        variants: [],
        version: 1,
      },
      {
        id: '2',
        name: { en: 'Product 2' },
        masterVariant: {
          id: 2,
          images: [
            {
              url: 'image2.jpg',
              dimensions: {
                w: 100,
                h: 100,
              },
            },
          ],
          prices: [
            {
              id: 'price2',
              value: {
                type: 'centPrecision',
                currencyCode: 'EUR',
                centAmount: 2000,
                fractionDigits: 2,
              },
            },
          ],
        },
        categories: [],
        createdAt: '2024-01-01T00:00:00.000Z',
        lastModifiedAt: '2024-01-01T00:00:00.000Z',
        productType: {
          typeId: 'productType',
          id: 'productTypeId',
        },
        slug: { en: 'product-2' },
        variants: [],
        version: 1,
      },
    ];

    await catalogPage.getInfoFilteredProducts(filteredProducts);

    expect(catalogPage.productsDisplayed).toEqual(filteredProducts);

    const productCards =
      catalogPage.productsContainer.querySelectorAll('.productCard');
    expect(productCards.length).toBe(2);

    const firstProductCard = productCards[0];
    expect(
      firstProductCard.querySelector('.productImage')!.getAttribute('src')
    ).toBe('image1.jpg');
    expect(
      firstProductCard.querySelector('.productInfoBrief')!.textContent
    ).toBe('Sorry, no description available.');
    expect(firstProductCard.querySelector('.regularPrice')!.textContent).toBe(
      '€10.00'
    );
    const secondProductCard = productCards[1];
    expect(
      secondProductCard.querySelector('.productImage')!.getAttribute('src')
    ).toBe('image2.jpg');
    expect(
      secondProductCard.querySelector('.productInfoBrief')!.textContent
    ).toBe('Sorry, no description available.');
    expect(secondProductCard.querySelector('.regularPrice')!.textContent).toBe(
      '€20.00'
    );
    expect(secondProductCard.querySelector('.discountedPrice')).toBeNull();
  });

  it('should create brand and count array correctly', () => {
    const brands = [
      'happy cat',
      'happy dog',
      'applaws',
      'bozira',
      'cairo',
      'royal canin',
      'happy cat',
      'applaws',
      'happy cat',
    ];

    const result = catalogPage.createBrandAndCountArray(brands);

    expect(result).toEqual([
      { brand: 'applaws', count: 2 },
      { brand: 'bozira', count: 1 },
      { brand: 'cairo', count: 1 },
      { brand: 'happy cat', count: 3 },
      { brand: 'happy dog', count: 1 },
      { brand: 'royal canin', count: 1 },
    ]);
  });

  it('should handle empty brands array', () => {
    const brands: string[] = [];

    const result = catalogPage.createBrandAndCountArray(brands);

    expect(result).toEqual([]);
  });

  it('should handle array with one brand', () => {
    const brands = ['happy cat'];

    const result = catalogPage.createBrandAndCountArray(brands);

    expect(result).toEqual([{ brand: 'happy cat', count: 1 }]);
  });

  it('should handle array with multiple different brands', () => {
    const brands = [
      'happy cat',
      'happy dog',
      'applaws',
      'bozita',
      'cairo',
      'royal canin',
    ];

    const result = catalogPage.createBrandAndCountArray(brands);

    expect(result).toEqual([
      { brand: 'applaws', count: 1 },
      { brand: 'bozita', count: 1 },
      { brand: 'cairo', count: 1 },
      { brand: 'happy cat', count: 1 },
      { brand: 'happy dog', count: 1 },
      { brand: 'royal canin', count: 1 },
    ]);
  });
});
