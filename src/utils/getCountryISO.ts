import postCodes from '../assets/data/postal-codes';
import { PostalCodeObj } from '../types';

export function getCountryISOCode(country: string): string {
  const countryObj = postCodes.find(
    (el: PostalCodeObj) => el.Country.toLowerCase() === country.toLowerCase()
  );
  const ISO = countryObj?.ISO ? countryObj.ISO : '';
  return ISO;
}

export function getCountryFromISO(iso: string): string {
  const countryObj = postCodes.find(
    (el: PostalCodeObj) => iso.toLowerCase() === el.ISO.toLowerCase()
  );
  const country = countryObj?.Country ? countryObj.Country : '';
  return country;
}
