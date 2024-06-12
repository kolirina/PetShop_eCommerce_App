import { Image } from '@commercetools/platform-sdk';
import {
  addToCart,
  createAnonymousCart,
  createCart,
  deleteProductFromCart,
  getCartById,
  getProduct,
} from '../../api/SDK';
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
import Page from '../Page';
import Pages from '../../router/pageNames';
import priceFormatter from '../../utils/priceFormatter';
import { isDescription, isSpecification } from './constants';
import { lang } from '../../constants';
import styles from './productPage.module.css';
import { LineItem } from '../../types/cart';
import { createAnonymousUser } from '../../api/services';

class ProductPage extends Page {
  id: string;

  lineId: string;

  currentIndex: number = 0;

  constructor(router: Router, parentElement: HTMLElement) {
    super(router, parentElement);
    this.container.classList.add(styles.productPage);
    const match = window.location.pathname.match(/^\/product\/([a-z0-9-]+)$/);
    this.id = match ? match[1] : 'Error';
    this.lineId = '';
    this.displayProductInfo();
  }

  moveCarousel(editableCarousel: HTMLDivElement, direction: number) {
    const carousel = editableCarousel;
    const totalImages = carousel.childElementCount;
    this.currentIndex =
      (this.currentIndex + direction + totalImages) % totalImages;
    carousel.style.transform = `translateX(-${this.currentIndex * 100}%)`;
  }

  async displayProductInfo() {
    let response;
    try {
      response = await getProduct(this.id);
    } catch {
      this.container.textContent = `No product with id: ${this.id}`;
      const catalogButton = createBtn(
        styles.catalogButton,
        'Go to Catalog',
        this.container
      );
      catalogButton.addEventListener('click', () =>
        this.router.navigateTo(Pages.CATALOG)
      );
      return;
    }
    if (response && response.statusCode === 200) {
      const product = response.body.masterData.current;
      const baseInfo = createDiv(styles.baseInfo, this.container);

      const imageContainer = createDiv(styles.imageContainer, baseInfo);
      const carousel = createDiv(styles.carousel, imageContainer);
      product.masterVariant.images?.forEach((image) => {
        const img = createImg(
          styles.productImage,
          image.url,
          'product',
          carousel
        );
        img.addEventListener('click', () => {
          document.body.classList.add(styles.noscroll);
          this.openModal(carousel, product.masterVariant.images!);
        });
      });
      if (carousel.childElementCount > 1) {
        const prevButton = createBtn(
          styles.carouselButton,
          '<',
          imageContainer
        );
        prevButton.classList.add(styles.prevButton);
        prevButton.addEventListener('click', () =>
          this.moveCarousel(carousel, -1)
        );
        const nextButton = createBtn(
          styles.carouselButton,
          '>',
          imageContainer
        );
        nextButton.classList.add(styles.nextButton);
        nextButton.addEventListener('click', () =>
          this.moveCarousel(carousel, 1)
        );
      }

      const infoContainer = createDiv(styles.infoContainer, baseInfo);
      createParagraph(styles.productName, product.name[lang], infoContainer);
      const shortDescription =
        product.description![lang] ?? 'No description available';
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

      const addButton = createBtn(
        styles.addButton,
        'Add to cart',
        infoContainer
      );
      const removeButton = createBtn(
        styles.removeButton,
        'Remove from cart',
        infoContainer
      );

      let cartId: string = '';
      let cartVersion: string = '';
      const updateCartData = () => {
        if (localStorage.getItem('registered_user_cart_id')) {
          cartId = localStorage.getItem('registered_user_cart_id')!;
          cartVersion = localStorage.getItem('registered_user_cart_version')!;
        }
        if (
          !localStorage.getItem('registered_user_cart_id') &&
          localStorage.getItem('anonymous_cart_id')
        ) {
          cartId = localStorage.getItem('anonymous_cart_id')!;
          cartVersion = localStorage.getItem('anonymous_cart_version')!;
        }
      };
      updateCartData();

      addButton.addEventListener('click', async () => {
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
        updateCartData();
        const resp = await addToCart(this.id, 1, JSON.parse(cartVersion));
        this.lineId =
          resp.lineItems.find(
            (cartProduct: LineItem) => cartProduct.productId === this.id
          )?.id ?? '';
        addButton.disabled = true;
        addButton.textContent = 'Already in cart';
        removeButton.disabled = false;
        removeButton.textContent = 'Remove from cart';
      });
      removeButton.addEventListener('click', async () => {
        updateCartData();
        await deleteProductFromCart(cartId, this.lineId, Number(cartVersion));
        addButton.disabled = false;
        addButton.textContent = 'Add to cart';
        removeButton.disabled = true;
        removeButton.textContent = 'Not yet in cart';
      });

      if (cartId) {
        const cart = await getCartById(cartId);
        const productsInCart = cart.body.lineItems;
        const thisProduct: LineItem | undefined = productsInCart.find(
          (cartProduct: LineItem) => cartProduct.productId === this.id
        );
        if (thisProduct) {
          this.lineId = thisProduct.id;
          addButton.disabled = true;
          addButton.textContent = 'Already in cart';
        } else {
          removeButton.disabled = true;
          removeButton.textContent = 'Not yet in cart';
        }
      } else {
        removeButton.disabled = true;
        removeButton.textContent = 'Not yet in cart';
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

  openModal(smallCarousel: HTMLDivElement, images: Image[]) {
    const modal = createDiv(styles.modal, document.body);
    const closeModal = () => {
      modal.remove();
      document.body.classList.remove(styles.noscroll);
      this.moveCarousel(smallCarousel, 0);
    };
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    window.addEventListener('popstate', closeModal);
    const modalContent = createDiv(styles.modalContent, modal);
    const modalCarousel = createDiv(styles.modalCarousel, modalContent);
    images.forEach((image) => {
      createImg(styles.modalImage, image.url, 'enlarged image', modalCarousel);
    });
    this.moveCarousel(modalCarousel, 0);
    const closeButton = createSpan(styles.closeButton, '×', modalContent);
    closeButton.addEventListener('click', closeModal);
    if (modalCarousel.childElementCount > 1) {
      const prevModalButton = createBtn(styles.modalButton, '<', modalContent);
      prevModalButton.classList.add(styles.prevModalButton);
      prevModalButton.addEventListener('click', () =>
        this.moveCarousel(modalCarousel, -1)
      );

      const nextModalButton = createBtn(styles.modalButton, '>', modalContent);
      nextModalButton.classList.add(styles.nextModalButton);
      nextModalButton.addEventListener('click', () =>
        this.moveCarousel(modalCarousel, 1)
      );
    }
  }
}
export default ProductPage;
