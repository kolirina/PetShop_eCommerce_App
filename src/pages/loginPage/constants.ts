export enum EmailValidationErrors {
  FORMAT_ERROR = 'be properly formatted (e.g., user@example.com)',
  WHITESPACE_ERROR = 'not contain leading or trailing whitespace',
  DOMAIN_ERROR = 'contain a domain name (e.g., example.com)',
  AT_SYMBOL_ERROR = "contain an '@' symbol separating local part and domain name",
}

export enum PasswordValidationErrors {
  LENGTH_ERROR = 'be at least 8 characters long',
  UPPERCASE_ERROR = 'contain at least one uppercase letter (A-Z)',
  LOWERCASE_ERROR = 'contain at least one lowercase letter (a-z)',
  DIGIT_ERROR = 'contain at least one digit (0-9)',
  SPECIAL_CHAR_ERROR = 'contain at least one special character',
  WHITESPACE_ERROR = 'not contain leading or trailing whitespace',
}
