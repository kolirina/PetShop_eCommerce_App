import {
  ApiRoot,
  ClientResponse,
  CustomerUpdate,
} from '@commercetools/platform-sdk';
import { apiRoot, projectKey } from './ApiRoot';
import { AddressToChange, UserAddress, UserInfo } from '../types';
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
};
