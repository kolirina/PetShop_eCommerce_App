import postCodes from '../assets/data/postal-codes';
import { MIN_AGE } from '../pages/registrationPage/constants';
import {
  PostalCodeObj,
  ValidationObjAddresses,
  ValidationObjPersonal,
} from '../types';

export function validateOnlyAZ(value: string): boolean {
  const template: RegExp = /^[a-zA-Z]+$/;
  return template.test(value);
}

export function validateAZAndNum(value: string): boolean {
  const template: RegExp = /^[a-zA-Z0-9]+$/;
  return template.test(value);
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
  return value.length >= 1;
}

export function validateStreetNum(value: string): boolean {
  const template: RegExp = /^\d+[A-Za-z]?$/;
  return template.test(value);
}

export function checkAllInputs(
  objForCheck: ValidationObjPersonal | ValidationObjAddresses
) {
  const validationArr: boolean[] = Object.values(objForCheck);
  return validationArr.every((el) => el === true);
}

export function validateEmail(value: string): boolean {
  const template: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return template.test(value.trim());
}

export function validatePassword(value: string): boolean {
  const template: RegExp =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  if (!template.test(value) || value.trim() !== value) {
    return false;
  }
  return true;
}
