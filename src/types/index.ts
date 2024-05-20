export type ValidationObj = {
  firstName: boolean;
  lastName: boolean;
  birthDate: boolean;
  email: boolean;
  remail: boolean;
  password: boolean;
  rpassword: boolean;
  sh_city: boolean;
  sh_postCode: boolean;
  sh_country: boolean;
  sh_street: boolean;
  bi_city: boolean;
  bi_postCode: boolean;
  bi_country: boolean;
  bi_street: boolean;
};

export type CountryArr = string[];

export type PostalCodeObj = {
  Note: string;
  Country: string;
  ISO: string;
  Format: string;
  Regex: string;
};

export type UserAddress = {
  country: string;
  countryISO: string;
  postCode: string;
  city: string;
  street: string;
  isDefault: boolean;
};

export type UserInfo = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  shippingAddress: UserAddress;
  billingAddress: UserAddress;
};

export enum AddressTypes {
  SHIPPING = 'Shipping',
  BILLING = 'Billing',
}
