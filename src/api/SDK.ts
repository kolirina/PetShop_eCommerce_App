import {
  Cart,
  ClientResponse,
  CustomerUpdate,
} from '@commercetools/platform-sdk';
import { apiRoot, projectKey } from './ApiRoot';
import { AddressToChange, UserAddress, UserInfo } from '../types';
import { ByProjectKeyMeCartsPost, CartInfo } from '../types/cart';
import {
  lang,
  MAX_NUMBER_OF_PRODUCTS_DISPLAYED,
  MS_IN_SEC,
} from '../constants';
import SortBy from '../types/sortBy';
import getLocalToken from '../utils/getLocalToken';

async function getUser(email: string, password: string) {
  const resp = await apiRoot
    .withProjectKey({ projectKey })
    .me()
    .login()
    .post({
      body: {
        email,
        password,
        updateProductData: true,
      },
    })
    .execute();
  return resp;
}

async function registerUser(userInfo: UserInfo) {
  const resp = await apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .post({
      body: {
        email: userInfo.email,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        password: userInfo.password,
        dateOfBirth: userInfo.dateOfBirth,
      },
    })
    .execute();
  return resp;
}

async function getUserById(id: string): Promise<ClientResponse> {
  const resp: ClientResponse = await apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .withId({ ID: id })
    .get()
    .execute();
  return resp;
}

async function getCartByUserId(id: string): Promise<CartInfo> {
  const resp: ClientResponse = await apiRoot
    .withProjectKey({ projectKey })
    .carts()
    .get({
      queryArgs: {
        where: `customerId="${id}"`,
      },
    })
    .execute();
  const cart = resp.body.results[0].id;
  return { id: cart.id, version: cart.version };
}

async function addAddress(
  userInfo: UserInfo,
  addressToAdd: UserAddress,
  addressKey: string,
  userId: string
) {
  const user = await getUserById(userId);
  const resp = await apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .withId({ ID: userId })
    .post({
      body: {
        version: user.body.version,
        actions: [
          {
            action: 'addAddress',
            address: {
              key: addressKey,
              firstName: userInfo.firstName,
              lastName: userInfo.lastName,
              country: addressToAdd.countryISO,
              streetName: addressToAdd.street,
              postalCode: addressToAdd.postCode,
              city: addressToAdd.city,
              email: userInfo.email,
              streetNumber: addressToAdd.streetNumber,
            },
          },
        ],
      },
    })
    .execute();
  return resp;
}

async function setShippingAddress(addressId: string, userId: string) {
  const user = await getUserById(userId);

  const resp = await apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .withId({ ID: userId })
    .post({
      body: {
        version: user.body.version,
        actions: [
          {
            action: 'addShippingAddressId',
            addressId,
          },
        ],
      },
    })
    .execute();
  return resp;
}

async function setBillingAddress(addressId: string, userId: string) {
  const user = await getUserById(userId);

  const resp = await apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .withId({ ID: userId })
    .post({
      body: {
        version: user.body.version,
        actions: [
          {
            action: 'addBillingAddressId',
            addressId,
          },
        ],
      },
    })
    .execute();
  return resp;
}

async function setDefaultShippingAddress(userId: string, addressId?: string) {
  const user = await getUserById(userId);
  const body: CustomerUpdate = {
    version: user.body.version,
    actions: [],
  };
  if (addressId) {
    body.actions.push({ action: 'setDefaultShippingAddress', addressId });
  } else {
    body.actions.push({ action: 'setDefaultShippingAddress' });
  }

  await apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .withId({ ID: userId })
    .post({
      body,
    })
    .execute();
}

async function setDefaultBillingAddress(userId: string, addressId?: string) {
  const user = await getUserById(userId);
  const body: CustomerUpdate = {
    version: user.body.version,
    actions: [],
  };
  if (addressId) {
    body.actions.push({ action: 'setDefaultBillingAddress', addressId });
  } else {
    body.actions.push({ action: 'setDefaultBillingAddress' });
  }
  await apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .withId({ ID: userId })
    .post({
      body,
    })
    .execute();
}

async function setFirstName(value: string, id: string) {
  const user = await getUserById(id);

  await apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .withId({ ID: id })
    .post({
      body: {
        version: user.body.version,
        actions: [
          {
            action: 'setFirstName',
            firstName: value,
          },
        ],
      },
    })
    .execute();
}

async function setLastName(value: string, id: string) {
  const user = await getUserById(id);

  await apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .withId({ ID: id })
    .post({
      body: {
        version: user.body.version,
        actions: [
          {
            action: 'setLastName',
            lastName: value,
          },
        ],
      },
    })
    .execute();
}

async function setDateOfBirth(value: string, id: string) {
  const user = await getUserById(id);

  await apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .withId({ ID: id })
    .post({
      body: {
        version: user.body.version,
        actions: [
          {
            action: 'setDateOfBirth',
            dateOfBirth: value,
          },
        ],
      },
    })
    .execute();
}

async function fetchProducts(sortBy: SortBy) {
  const resp = await apiRoot
    .withProjectKey({ projectKey })
    .productProjections()
    .search()
    .get({
      queryArgs: {
        limit: MAX_NUMBER_OF_PRODUCTS_DISPLAYED,
        sort: [`${sortBy}`],
      },
    })
    .execute();
  return resp.body.results;
}

async function changeAddress(
  addressId: string,
  address: AddressToChange,
  userId: string
) {
  const user = await getUserById(userId);

  await apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .withId({ ID: userId })
    .post({
      body: {
        version: user.body.version,
        actions: [
          {
            action: 'changeAddress',
            addressId,
            address: {
              country: address.countryISO,
              postalCode: address.postCode,
              city: address.city,
              streetName: address.street,
              streetNumber: address.streetNumber,
            },
          },
        ],
      },
    })
    .execute();
}

async function changeEmail(email: string, userId: string) {
  const user = await getUserById(userId);

  await apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .withId({ ID: userId })
    .post({
      body: {
        version: user.body.version,
        actions: [
          {
            action: 'changeEmail',
            email,
          },
        ],
      },
    })
    .execute();
}

async function changePassword(curPwd: string, newPwd: string, userId: string) {
  const user = await getUserById(userId);

  await apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .password()
    .post({
      body: {
        id: userId,
        version: user.body.version,
        currentPassword: curPwd,
        newPassword: newPwd,
      },
    })
    .execute();
}

async function fetchFilteredByPriceAndBrandAndSearch(
  minPrice: number,
  maxPrice: number,
  brands: string[],
  searchWord: string,
  sortBy: SortBy,
  categoryId: string
) {
  const filterQueries = [];
  if (maxPrice && minPrice) {
    filterQueries.push(
      `variants.price.centAmount:range(${minPrice} to ${maxPrice})`
    );
  }
  if (!(brands.length === 0)) {
    filterQueries.push(`variants.attributes.brand:"${brands.join('", "')}"`);
  }
  if (categoryId) {
    filterQueries.push(`categories.id:subtree("${categoryId}")`);
  }
  if (searchWord) {
    const resp = await apiRoot
      .withProjectKey({ projectKey })
      .productProjections()
      .search()
      .get({
        queryArgs: {
          'filter.query': filterQueries,
          [`text.${lang}`]: `"${searchWord}"`,
          limit: MAX_NUMBER_OF_PRODUCTS_DISPLAYED,
          fuzzy: true,
          staged: true,
          sort: `${sortBy}`,
        },
      })
      .execute();
    return resp.body.results;
  }
  const resp = await apiRoot
    .withProjectKey({ projectKey })
    .productProjections()
    .search()
    .get({
      queryArgs: {
        'filter.query': filterQueries,
        limit: MAX_NUMBER_OF_PRODUCTS_DISPLAYED,
        sort: `${sortBy}`,
      },
    })
    .execute();
  return resp.body.results;
}

async function getSearchResult(word: string, sortBy: SortBy) {
  const resp = await apiRoot
    .withProjectKey({ projectKey })
    .productProjections()
    .search()
    .get({
      queryArgs: {
        staged: true,
        limit: MAX_NUMBER_OF_PRODUCTS_DISPLAYED,
        [`text.${lang}`]: `"${word}"`,
        fuzzy: true,
        sort: `${sortBy}`,
      },
    })
    .execute();
  return resp.body.results;
}

async function getProduct(id: string) {
  const resp = await apiRoot
    .withProjectKey({ projectKey })
    .products()
    .withId({ ID: id })
    .get()
    .execute();
  return resp;
}

async function removeAddress(addressId: string, userId: string) {
  const user = await getUserById(userId);

  await apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .withId({ ID: userId })
    .post({
      body: {
        version: user.body.version,
        actions: [
          {
            action: 'removeAddress',
            addressId,
          },
        ],
      },
    })
    .execute();
}

async function getCategories() {
  const resp = await apiRoot
    .withProjectKey({ projectKey })
    .categories()
    .get()
    .execute();

  return resp.body.results;
}

async function getCartById(cartId: string): Promise<ClientResponse> {
  const token = localStorage.getItem('token')
    ? localStorage.getItem('token')
    : localStorage.getItem('anonymous_token');

  try {
    const resp = await apiRoot
      .withProjectKey({ projectKey })
      .me()
      .carts()
      .withId({ ID: cartId })
      .get({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .execute();

    return resp;
  } catch (err: unknown) {
    throw new Error(`${(err as Error).message}`);
  }
}

async function getAnonymousCartById(cartId: string): Promise<ClientResponse> {
  const token = localStorage.getItem('anonymous_token');

  try {
    const resp = await apiRoot
      .withProjectKey({ projectKey })
      .me()
      .carts()
      .withId({ ID: cartId })
      .get({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .execute();

    return resp;
  } catch (err: unknown) {
    throw new Error(`${(err as Error).message}`);
  }
}

async function createAnonymousCart() {
  const token = localStorage.getItem('anonymous_token');
  const cartDraft: ByProjectKeyMeCartsPost = {
    currency: 'EUR',
  };
  try {
    const response = await apiRoot
      .withProjectKey({ projectKey })
      .me()
      .carts()
      .post({
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: cartDraft,
      })
      .execute();
    localStorage.setItem('anonymous_cart_id', response.body.id);
    localStorage.setItem(
      'anonymous_cart_version',
      JSON.stringify(response.body.version)
    );
  } catch (error) {
    throw new Error('Error creating cart');
  }
}

async function createCart(customerId: string) {
  const token = localStorage.getItem('token');
  const cartDraft: ByProjectKeyMeCartsPost = {
    currency: 'EUR',
    customerId,
  };
  await apiRoot
    .withProjectKey({ projectKey })
    .me()
    .carts()
    .post({
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: cartDraft,
    })
    .execute()
    .then((response) => {
      localStorage.setItem('registered_user_cart_id', response.body.id);
      localStorage.setItem(
        'registered_user_cart_version',
        JSON.stringify(response.body.version)
      );
    })
    .catch(() => {
      throw new Error('Error creating cart');
    });
}

async function addToCart(
  productId: string,
  quantity: number,
  cartVers: number
) {
  const token = localStorage.getItem('token')
    ? localStorage.getItem('token')
    : localStorage.getItem('anonymous_token');
  let cartId: string | null = '';
  let cartVersion: string | null = '';
  if (localStorage.getItem('registered_user_cart_id')) {
    cartId = localStorage.getItem('registered_user_cart_id');
    cartVersion = localStorage.getItem('registered_user_cart_version');
  }
  if (
    !localStorage.getItem('registered_user_cart_id') &&
    localStorage.getItem('anonymous_cart_id')
  ) {
    cartId = localStorage.getItem('anonymous_cart_id');
    cartVersion = localStorage.getItem('anonymous_cart_version');
  }
  if (!cartId || !cartVersion) {
    throw new Error('Cart ID or version is missing');
  }
  const resp = await apiRoot
    .withProjectKey({ projectKey })
    .me()
    .carts()
    .withId({ ID: cartId! })
    .post({
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        version: cartVers,
        actions: [
          {
            action: 'addLineItem',
            productId,
            variantId: 1,
            quantity,
          },
        ],
      },
    })
    .execute();
  if (cartId === localStorage.getItem('anonymous_cart_id')) {
    localStorage.setItem(
      'anonymous_cart_version',
      JSON.stringify(resp.body.version)
    );
  } else {
    localStorage.setItem(
      'registered_user_cart_version',
      JSON.stringify(resp.body.version)
    );
  }
  const data = resp.body;
  return data;
}

async function refreshAnonymousToken(): Promise<void> {
  const CTP_CLIENT_ID = import.meta.env.VITE_CTP_CLIENT_ID;
  const CTP_CLIENT_SECRET = import.meta.env.VITE_CTP_CLIENT_SECRET;
  const CTP_AUTH_URL = import.meta.env.VITE_CTP_AUTH_URL;
  const CTP_PROJECT_KEY = import.meta.env.VITE_CTP_PROJECT_KEY;
  const anonRefreshToken = localStorage.getItem('anonymous_refresh_token');

  const response = await fetch(
    `${CTP_AUTH_URL}/oauth/${CTP_PROJECT_KEY}/customers/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${CTP_CLIENT_ID}:${CTP_CLIENT_SECRET}`)}`,
      },
      body: `grant_type=refresh_token&refresh_token=${anonRefreshToken}`,
    }
  );

  const data = await response.json();
  const tokenTimeInMs = data.expires_in * MS_IN_SEC;
  localStorage.setItem('anonymous_token', data.access_token);
  localStorage.setItem(
    'anonymous_token_time',
    String(Date.now() + tokenTimeInMs)
  );
}

async function deleteProductFromCart(
  cartId: string,
  productId: string,
  cartVersion: number
): Promise<Cart> {
  const token = localStorage.getItem('token')
    ? localStorage.getItem('token')
    : localStorage.getItem('anonymous_token');
  const response = await apiRoot
    .withProjectKey({ projectKey })
    .me()
    .carts()
    .withId({ ID: cartId })
    .post({
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        version: cartVersion,
        actions: [
          {
            action: 'removeLineItem',
            lineItemId: productId,
          },
        ],
      },
    })
    .execute();
  if (cartId === localStorage.getItem('anonymous_cart_id')) {
    localStorage.setItem(
      'anonymous_cart_version',
      JSON.stringify(response.body.version)
    );
  } else {
    localStorage.setItem(
      'registered_user_cart_version',
      JSON.stringify(response.body.version)
    );
  }
  const data = response.body;
  return data;
}

async function changeProductQuantity(
  cartId: string,
  productId: string,
  cartVersion: number,
  quantity: number
): Promise<Cart> {
  const token = localStorage.getItem('token')
    ? localStorage.getItem('token')
    : localStorage.getItem('anonymous_token');
  const response = await apiRoot
    .withProjectKey({ projectKey })
    .me()
    .carts()
    .withId({ ID: cartId })
    .post({
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        version: cartVersion,
        actions: [
          {
            action: 'changeLineItemQuantity',
            lineItemId: productId,
            quantity,
          },
        ],
      },
    })
    .execute();
  const data = response.body;
  return data;
}

export {
  getUser,
  registerUser,
  addAddress,
  setShippingAddress,
  setBillingAddress,
  setDefaultShippingAddress,
  setDefaultBillingAddress,
  fetchProducts,
  getUserById,
  setFirstName,
  setLastName,
  setDateOfBirth,
  changeAddress,
  changeEmail,
  changePassword,
  getSearchResult,
  fetchFilteredByPriceAndBrandAndSearch,
  getProduct,
  removeAddress,
  getCategories,
  getCartById,
  createAnonymousCart,
  createCart,
  getCartByUserId,
  addToCart,
  refreshAnonymousToken,
  deleteProductFromCart,
  getAnonymousCartById,
  changeProductQuantity,
};
