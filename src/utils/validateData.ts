import postCodes from '../assets/data/postal-codes';
import { MIN_AGE } from '../pages/registrationPage/constants';
import {
  PostalCodeObj,
  ValidationObjAddresses,
  ValidationObjPersonal,
} from '../types';

export function validateOnlyAZ(value: string): boolean {
  const template: RegExp = /^[a-zA-Z]+$/;
  if (!template.test(value)) {
    return false;
  }
  return true;
}

export function validateAZAndNum(value: string): boolean {
  const template: RegExp = /^[a-zA-Z0-9]+$/;
  if (!template.test(value)) {
    return false;
  }
  return true;
}

export function validateDateOfBirth(value: string): boolean {
  const birthDate = new Date(value);
  const now = new Date();
  const minBirthDate = new Date(
    now.getFullYear() - MIN_AGE,
    now.getMonth(),
    now.getDate() + 1
  );
  if (birthDate >= minBirthDate) {
    return false;
  }
  return true;
}

export function validateCountry(value: string): boolean {
  if (
    !postCodes.find(
      (el: PostalCodeObj) => el.Country.toLowerCase() === value.toLowerCase()
    )
  ) {
    return false;
  }
  return true;
}

export function validatePostalCode(
  value: string,
  country: string
): boolean | string {
  let pattern: RegExp = /^.*$/;
  const postObj: PostalCodeObj | undefined = postCodes.find(
    (el: PostalCodeObj) => el.Country.toLowerCase() === country.toLowerCase()
  );
  if (!postObj) {
    return 'no_country';
  }
  if (postObj?.Format === 'no codes') {
    return 'no codes';
  }
  if (postObj?.Regex) {
    pattern = postObj?.Regex !== '' ? new RegExp(postObj?.Regex) : /^.*$/;
  }
  if (!pattern.test(value) || value.length === 0) {
    return postObj?.Format;
  }
  return true;
}

export function validateStreet(value: string): boolean {
  if (value.length < 1) {
    return false;
  }
  return true;
}

export function validateStreetNum(value: string): boolean {
  const template: RegExp = /^\d+[A-Za-z]?$/;
  if (!template.test(value)) {
    return false;
  }
  return true;
}

export function checkAllInputs(
  objForCheck: ValidationObjPersonal | ValidationObjAddresses
) {
  const validationArr: boolean[] = Object.values(objForCheck);
  if (validationArr.every((el) => el === true)) {
    return true;
  }
  return false;
}
