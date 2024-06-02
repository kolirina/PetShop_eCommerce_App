import { ApiRoot, ClientResponse } from '@commercetools/platform-sdk';
import { apiRoot, projectKey } from './ApiRoot';
import { AddressTypes, UserAddress, UserInfo } from '../types';
import { lang, MAX_NUMBER_OF_PRODUCTS_DISPLAYED } from '../constants';
import SortBy from '../types/sortBy';

async function getUser(
  email: string,
  password: string,
  passwordApiRoot: ApiRoot
) {
  const resp = await passwordApiRoot
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

async function addAddress(
  userInfo: UserInfo,
  addressToAdd: UserAddress,
  addressType: AddressTypes,
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
              key: addressType,
              firstName: userInfo.firstName,
              lastName: userInfo.lastName,
              country: addressToAdd.countryISO,
              streetName: addressToAdd.street,
              postalCode: addressToAdd.postCode,
              city: addressToAdd.city,
              email: userInfo.email,
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

async function setDefaultShippingAddress(userId: string, addressId: string) {
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
            action: 'setDefaultShippingAddress',
            addressId,
          },
        ],
      },
    })
    .execute();
}

async function setDefaultBillingAddress(userId: string, addressId: string) {
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
            action: 'setDefaultBillingAddress',
            addressId,
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

async function fetchFilteredByPriceAndBrandAndSearch(
  minPrice: number,
  maxPrice: number,
  brands: string[],
  searchWord: string,
  sortBy: SortBy
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

export {
  getUser,
  registerUser,
  addAddress,
  setShippingAddress,
  setBillingAddress,
  setDefaultShippingAddress,
  setDefaultBillingAddress,
  fetchProducts,
  getSearchResult,
  fetchFilteredByPriceAndBrandAndSearch,
};
