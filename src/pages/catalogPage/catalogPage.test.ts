import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import CatalogPage from '.';
import Router from '../../router';
import TemplatePage from '../templatePage';

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

    container = document.body.appendChild(document.createElement('div'));

    const mainElement = templatePage.getMainElement();
    container.appendChild(mainElement);
    catalogPage = new CatalogPage(router, mainElement);
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

  it('should create catalog correctly', () => {
    expect(container.querySelector('.banner')).not.toBeNull();
    expect(container.querySelector('.sortSearchPanel')).not.toBeNull();
    expect(container.querySelector('.showFiltersButton')).not.toBeNull();
    expect(
      container.querySelector('.productsContainerPlusAside')
    ).not.toBeNull();
    expect(container.querySelector('.breadcrumbsContainer')).not.toBeNull();
    expect(container.querySelector('.searchDiv')).not.toBeNull();
    expect(container.querySelector('.searchButton')).not.toBeNull();
    expect(container.querySelector('.catalogSelect')).not.toBeNull();
    expect(catalogPage.productsPlusLoadMore).not.toBeNull();
    expect(container.querySelector('.showFiltersButton')).not.toBeNull();
    catalogPage.showFiltersButton.click();
    expect(catalogPage.aside.classList.contains('visible')).toBe(true);
    expect(catalogPage.showFiltersButton.textContent).toBe('Hide Filters');
    catalogPage.showFiltersButton.click();
    expect(catalogPage.aside.classList.contains('visible')).toBe(false);
    expect(catalogPage.showFiltersButton.textContent).toBe('Show Filters');
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

  it('should display product card correctly', () => {
    const productId = 'testProductId';
    const productName = 'Test Product';
    const productImageSrc = 'test-image.jpg';
    const productDescription = 'Test description';
    const regularPrice = 100;
    const discountedPrice = 80;

    catalogPage.displayProductCard(
      { id: productId },
      productName,
      productImageSrc,
      productDescription,
      regularPrice,
      discountedPrice
    );

    const productCard = container.querySelector('.productCard');
    expect(productCard).not.toBeNull();

    const productNameElement = productCard!.querySelector('.productName');
    expect(productNameElement).not.toBeNull();
    expect(productNameElement!.innerHTML).toContain(productName);

    const productImageElement = productCard!.querySelector('.productImage');
    expect(productImageElement).not.toBeNull();
    expect(productImageElement!.getAttribute('src')).toBe(productImageSrc);

    const productInfoBriefElement =
      productCard!.querySelector('.productInfoBrief');
    expect(productInfoBriefElement).not.toBeNull();
    expect(productInfoBriefElement!.innerHTML).toContain(productDescription);

    const regularPriceElement = productCard!.querySelector('.regularPrice');
    expect(regularPriceElement).not.toBeNull();
    expect(regularPriceElement!.innerHTML).toContain('€1.00');

    const addToCartButton = productCard!.querySelector(
      '.addToCartButton'
    ) as HTMLButtonElement;
    expect(addToCartButton).not.toBeNull();
    expect(addToCartButton!.classList.contains('alreadyInCart')).toBeFalsy();
    expect(addToCartButton.disabled).toBeFalsy();
    catalogPage.productsInCartIds.push(productId);
    addToCartButton!.click();
    expect(addToCartButton!.classList.contains('alreadyInCart')).toBeTruthy();
  });
});
