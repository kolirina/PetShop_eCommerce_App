import { AddressTypes, UserInfo } from '../types';
import { apiRoot } from './ApiRoot';
import {
  addAddress,
  getUser,
  registerUser,
  setBillingAddress,
  setDefaultBillingAddress,
  setDefaultShippingAddress,
  setShippingAddress,
} from './SDK';

const getToken = async (): Promise<string> => {
  const CTP_AUTH_URL = import.meta.env.VITE_CTP_AUTH_URL;
  const CTP_CLIENT_ID = import.meta.env.VITE_CTP_CLIENT_ID;
  const CTP_CLIENT_SECRET = import.meta.env.VITE_CTP_CLIENT_SECRET;

  const response = await fetch(
    `${CTP_AUTH_URL}/oauth/token?grant_type=client_credentials`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${CTP_CLIENT_ID}:${CTP_CLIENT_SECRET}`)}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`An error occurred: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
};

const loginUser = async (email: string, password: string): Promise<string> => {
  const token = await getToken();
  localStorage.setItem('token', token);

  const response = await getUser(email, password, apiRoot);

  if (response.statusCode === 400) {
    throw new Error('Invalid email or password');
  }

  const { id } = response.body.customer;
  localStorage.setItem('id', id);
  return id;
};

const signUpUser = async (userInfo: UserInfo) => {
  const token = await getToken();
  localStorage.setItem('token', token);

  try {
    const response = await registerUser(userInfo);
    const { id } = response.body.customer;
    localStorage.setItem('id', id);

    return id;
  } catch (err) {
    throw new Error(
      'There is already an existing customer with the provided email.'
    );
  }
};

const addAddresses = async (userInfo: UserInfo, userId: string) => {
  const token = await getToken();
  localStorage.setItem('token', token);

  try {
    const addedShippingAddress = await addAddress(
      userInfo,
      userInfo.shippingAddress,
      AddressTypes.SHIPPING,
      userId
    );
    const shippingAddressId = addedShippingAddress?.body.addresses.find(
      (e) => e.key === AddressTypes.SHIPPING
    )?.id;
    if (shippingAddressId) {
      await setShippingAddress(shippingAddressId, userId);
      if (userInfo.shippingAddress.isDefault) {
        await setDefaultShippingAddress(userId, shippingAddressId);
      }
    }
    const addedBillingAddress = await addAddress(
      userInfo,
      userInfo.billingAddress,
      AddressTypes.BILLING,
      userId
    );
    const billingAddressId = addedBillingAddress?.body.addresses.find(
      (e) => e.key === AddressTypes.BILLING
    )?.id;
    if (billingAddressId) {
      await setBillingAddress(billingAddressId, userId);
      await setDefaultBillingAddress(userId, billingAddressId);
    }
  } catch (err) {
    throw new Error('Unable to add the addresses.');
  }
};

export { getToken, loginUser, signUpUser, addAddresses };
