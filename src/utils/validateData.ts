import { MIN_AGE } from '../pages/registrationPage/constants';
import { ValidationObjPersonal } from '../types';

export function validateOnlyAZ(value: string): boolean {
  const template: RegExp = /^[a-zA-Z]+$/;
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

export function checkAllInputs(objForCheck: ValidationObjPersonal) {
  const validationArr: boolean[] = Object.values(objForCheck);
  if (validationArr.every((el) => el === true)) {
    return true;
  }
  return false;
}
