export const INPUT_FORM_COUNT = 15;

export enum ValidationErrors {
  NAMES_CITY_ERR = '* Must contain latin letters',
  AGE_ERR = '* User must be older than 13',
  EMAIL_ERR = '* Invalid format (e.g., user@example.com)',
  REPEAT_EMAIL_ERR = '* Emails are different',
  PASSWORD_ERR = '* Password: min 8 chars, upper & lower case, special char, no leading/trailing whitespace',
  REPEAT_PASSWORD_ERR = '* Passwords are different',
  COUNTRY_ERR = '* There is no such country',
  POSTCODE_ERR = '* Invalid post code',
  STREET_ERR = '* Must contain more than 1 symbol',
  NO_COUNTRY = '* First enter a country',
  STREET_NUM_ERR = '* Must contain digits and latin letter',
}

export const MIN_AGE = 13;
