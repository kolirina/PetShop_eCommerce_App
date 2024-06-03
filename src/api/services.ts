import { MAX_CHAR_CODE, MIN_CHAR_CODE } from '../constants';
import { AddressToChange, UserInfo } from '../types';
import { apiRoot } from './ApiRoot';
import {
  addAddress,
  changeAddress,
  changeEmail,
  changePassword,
  getUser,
  registerUser,
  removeAddress,
  setBillingAddress,
  setDateOfBirth,
  setDefaultBillingAddress,
  setDefaultShippingAddress,
  setFirstName,
  setLastName,
  setShippingAddress,
} from './SDK';

async function getToken(email: string, password: string): Promise<string> {
  const CTP_AUTH_URL = import.meta.env.VITE_CTP_AUTH_URL;
  const CTP_PROJECT_KEY = import.meta.env.VITE_CTP_PROJECT_KEY;
  const CTP_CLIENT_ID = import.meta.env.VITE_CTP_CLIENT_ID;
  const CTP_CLIENT_SECRET = import.meta.env.VITE_CTP_CLIENT_SECRET;

  const response = await fetch(
    `${CTP_AUTH_URL}/oauth/${CTP_PROJECT_KEY}/customers/token?grant_type=password&username=${email}&password=${password}`,
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
}

const loginUser = async (email: string, password: string): Promise<string> => {
  const token = await getToken(email, password);
  localStorage.setItem('token', token);

  const response = await getUser(email, password, apiRoot);

  if (response.statusCode === 400) {
    throw new Error('Invalid email or password');
  }

  const { id } = response.body.customer;
  localStorage.setItem('id', id);
  return id;
};

const signUpUser = async (
  userInfo: UserInfo
): Promise<{ id: string; token: string }> => {
  try {
    const response = await registerUser(userInfo);
    const { id } = response.body.customer;
    localStorage.setItem('id', id);

    try {
      const token = await getToken(userInfo.email, userInfo.password);
      localStorage.setItem('token', token);

      return { id, token };
    } catch (tokenError) {
      throw new Error('Failed to retrieve authentication token.');
    }
  } catch (err) {
    throw new Error(
      'There is already an existing customer with the provided email.'
    );
  }
};

const generateAddressKey = (userId: string) => {
  let result = '';
  for (let i = 0; i < 5; i += 1) {
    const randomNum =
      Math.floor(Math.random() * (MAX_CHAR_CODE - MIN_CHAR_CODE + 1)) +
      MIN_CHAR_CODE;
    result += String.fromCharCode(randomNum);
  }
  return userId.slice(0, 6) + result;
};

const addAddresses = async (userInfo: UserInfo, userId: string) => {
  const token = await getToken(userInfo.email, userInfo.password);
  localStorage.setItem('token', token);

  try {
    let addressKey = generateAddressKey(userId);

    const addedShippingAddress = await addAddress(
      userInfo,
      userInfo.shippingAddress,
      addressKey,
      userId
    );
    const shippingAddressId = addedShippingAddress?.body.addresses.find(
      (e) => e.key === addressKey
    )?.id;
    if (shippingAddressId) {
      await setShippingAddress(shippingAddressId, userId);
      if (userInfo.shippingAddress.isDefault) {
        await setDefaultShippingAddress(userId, shippingAddressId);
      }
    }
    addressKey = generateAddressKey(userId);
    const addedBillingAddress = await addAddress(
      userInfo,
      userInfo.billingAddress,
      addressKey,
      userId
    );
    const billingAddressId = addedBillingAddress?.body.addresses.find(
      (e) => e.key === addressKey
    )?.id;
    if (billingAddressId) {
      await setBillingAddress(billingAddressId, userId);
      await setDefaultBillingAddress(userId, billingAddressId);
    }
  } catch (err) {
    throw new Error('Unable to add the addresses.');
  }
};

const addNewUsersAddress = async (
  userInfo: UserInfo,
  address: AddressToChange,
  userId: string
) => {
  const addressKey = generateAddressKey(userId);

  try {
    const response = await addAddress(userInfo, address, addressKey, userId);
    const currentAddress = response.body.addresses.find(
      (e) => e.key === addressKey
    );
    if (currentAddress) {
      if (address.isBillingDefault) {
        await setDefaultBillingAddress(userId, currentAddress.id);
      } else {
        await setDefaultBillingAddress(userId);
      }
      if (address.isShippingDefault) {
        await setDefaultShippingAddress(userId, currentAddress.id);
      } else {
        await setDefaultShippingAddress(userId);
      }
    }

    return currentAddress;
  } catch (error) {
    throw new Error("The new address hasn't been changed.");
  }
};

const setUsersFirstName = async (value: string, id: string): Promise<void> => {
  try {
    await setFirstName(value, id);
  } catch (error) {
    throw new Error("First name hasn't been changed.");
  }
};

const setUsersLastName = async (value: string, id: string): Promise<void> => {
  try {
    await setLastName(value, id);
  } catch (error) {
    throw new Error("Last name hasn't been changed.");
  }
};

const setUsersDateOfBirth = async (
  value: string,
  id: string
): Promise<void> => {
  try {
    await setDateOfBirth(value, id);
  } catch (error) {
    throw new Error("Date of birth hasn't been changed.");
  }
};

const changeUsersAddress = async (
  addressId: string,
  address: AddressToChange,
  userId: string
) => {
  try {
    await changeAddress(addressId, address, userId);
    if (address.isBillingDefault) {
      await setDefaultBillingAddress(userId, addressId);
    } else {
      await setDefaultBillingAddress(userId);
    }
    if (address.isShippingDefault) {
      await setDefaultShippingAddress(userId, addressId);
    } else {
      await setDefaultShippingAddress(userId);
    }
  } catch (error) {
    throw new Error("Address wasn't changed");
  }
};

const changeUsersEmail = async (email: string, userId: string) => {
  try {
    await changeEmail(email, userId);
  } catch (error) {
    throw new Error("Address wasn't changed");
  }
};

const changeUsersPassword = async (
  curPwd: string,
  newPwd: string,
  userId: string
) => {
  try {
    await changePassword(curPwd, newPwd, userId);
  } catch (error) {
    throw new Error("Address hasn't been changed");
  }
};

const removeUsersAddress = async (addressId: string, userId: string) => {
  try {
    await removeAddress(addressId, userId);
  } catch (error) {
    throw new Error("Address hasn't been deleted");
  }
};

export {
  getToken,
  loginUser,
  signUpUser,
  addAddresses,
  setUsersFirstName,
  setUsersLastName,
  setUsersDateOfBirth,
  changeUsersAddress,
  changeUsersEmail,
  changeUsersPassword,
  addNewUsersAddress,
  removeUsersAddress,
  generateAddressKey,
};
