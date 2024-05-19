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
