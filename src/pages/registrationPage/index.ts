import Router from '../../router';
import {
  createBtn,
  createDiv,
  createForm,
  createH1,
  createH3,
  createInput,
  createLabel,
  createLocalLink,
} from '../../utils/elementCreator';
import Page from '../Page';
import './registrationPage.css';
import postCodes from '../../assets/data/postal-codes';
import { PostalCodeObj, UserInfo, ValidationObj } from '../../types';
import { INPUT_FORM_COUNT, MIN_AGE, ValidationErrors } from './constants';
import AddressBlock from './addressesBlocks';
import Pages from '../../router/pageNames';
import TemplatePage from '../templatePage';
import { addAddresses, signUpUser } from '../../api/services';

function getCountryISOCode(country: string): string {
  const countryObj = postCodes.find(
    (el: PostalCodeObj) => el.Country.toLowerCase() === country.toLowerCase()
  );
  const ISO = countryObj?.ISO ? countryObj.ISO : '';
  return ISO;
}

class RegistrationPage extends Page {
  protected templatePage: TemplatePage;

  protected registerForm: HTMLFormElement;

  protected passwordInput: HTMLInputElement;

  protected repeatPasswordInput: HTMLInputElement;

  protected emailInput: HTMLInputElement;

  protected confirmEmailInput: HTMLInputElement;

  protected firstNameInput: HTMLInputElement;

  protected lastNameInput: HTMLInputElement;

  protected birthDateInput: HTMLInputElement;

  protected birthDateLabel: HTMLLabelElement;

  protected nameWrapper: HTMLDivElement;

  protected emailWrapper: HTMLDivElement;

  protected submitBtn: HTMLButtonElement;

  protected areAllInputsValid: ValidationObj;

  protected registerHeading: HTMLHeadingElement;

  protected registerImg: HTMLDivElement;

  protected firstNameWrapper: HTMLLabelElement;

  protected lastNameWrapper: HTMLLabelElement;

  protected emailInputWrapper: HTMLLabelElement;

  protected repeatEmailWrapper: HTMLLabelElement;

  protected passwordInputWrapper: HTMLLabelElement;

  protected repeatPasswordWrapper: HTMLLabelElement;

  protected birthDateWrapper: HTMLDivElement;

  protected userInfoHeading: HTMLHeadingElement;

  protected userInfoWrapper: HTMLDivElement;

  protected shippingAddressBlock: AddressBlock;

  protected billingAddressBlock: AddressBlock;

  protected addressesHeading: HTMLHeadingElement;

  protected addressesWrapper: HTMLDivElement;

  protected loginWrapper: HTMLDivElement;

  protected loginLink: HTMLAnchorElement;

  protected firstNameErrorDiv: HTMLDivElement;

  protected lastNameErrorDiv: HTMLDivElement;

  protected ageErrorDiv: HTMLDivElement;

  protected emailErrorDiv: HTMLDivElement;

  protected rEmailErrorDiv: HTMLDivElement;

  protected passwordErrorDiv: HTMLDivElement;

  protected rPasswordErrorDiv: HTMLDivElement;

  protected registrationErrorPopup?: HTMLDivElement;

  protected showHidePasswordBtn: HTMLButtonElement;

  protected repeatShowHidePasswordBtn: HTMLButtonElement;

  protected defaultBillingAddressLabel?: HTMLLabelElement;

  protected defaultBillingAddressInput?: HTMLInputElement;

  protected defaultShippingAddressLabel?: HTMLLabelElement;

  protected defaultShippingAddressInput?: HTMLInputElement;

  constructor(router: Router, templatePage: TemplatePage) {
    super(router, templatePage.getMainElement());
    this.templatePage = templatePage;
    this.areAllInputsValid = {
      firstName: false,
      lastName: false,
      birthDate: false,
      email: false,
      remail: false,
      password: false,
      rpassword: false,
      sh_city: false,
      sh_postCode: false,
      sh_country: false,
      sh_street: false,
      bi_city: false,
      bi_postCode: false,
      bi_country: false,
      bi_street: false,
    };
    this.container = createDiv('container', document.body);
    this.registerForm = createForm('register-form', this.container);
    this.registerImg = createDiv('heading-img', this.registerForm);
    this.registerImg.innerHTML = '🐾';
    this.registerHeading = createH1(
      'register-heading',
      'Create an account',
      this.registerForm
    );

    this.userInfoHeading = createH3(
      'section-heading',
      'User info',
      this.registerForm
    );

    this.shippingAddressBlock = new AddressBlock('Shipping');
    this.billingAddressBlock = new AddressBlock('Billing');

    this.userInfoWrapper = createDiv('user-info-wrapper', this.registerForm);

    this.nameWrapper = createDiv('name-wrapper', this.userInfoWrapper);
    this.firstNameWrapper = createLabel('wrapper', '', this.nameWrapper);
    this.firstNameInput = createInput({
      className: 'first-name',
      type: 'text',
      isActive: true,
      isRequired: true,
      placeholder: 'Enter your first name',
      parentElement: this.firstNameWrapper,
    });
    this.firstNameErrorDiv = createDiv('error', this.firstNameWrapper);
    this.lastNameWrapper = createLabel('wrapper', '', this.nameWrapper);
    this.lastNameInput = createInput({
      className: 'last-name',
      type: 'text',
      isActive: true,
      isRequired: true,
      placeholder: 'Enter your last name',
      parentElement: this.lastNameWrapper,
    });
    this.lastNameErrorDiv = createDiv('error', this.lastNameWrapper);

    this.birthDateLabel = createLabel(
      'birth-label',
      'Birth date: ',
      this.userInfoWrapper
    );
    this.birthDateWrapper = createDiv('wrapper', this.birthDateLabel);
    this.birthDateInput = createInput({
      className: 'birth-date',
      type: 'date',
      isActive: true,
      isRequired: true,
      placeholder: 'Enter an e-mail',
      parentElement: this.birthDateWrapper,
    });
    this.birthDateInput.min = '1900-01-01';
    this.ageErrorDiv = createDiv('error', this.birthDateWrapper);

    this.emailWrapper = createDiv('email-wrapper', this.userInfoWrapper);
    this.emailInputWrapper = createLabel('wrapper', '', this.emailWrapper);
    this.emailInput = createInput({
      className: 'email',
      type: 'text',
      isActive: true,
      isRequired: true,
      placeholder: 'Enter an e-mail',
      parentElement: this.emailInputWrapper,
    });
    this.emailErrorDiv = createDiv('error', this.emailInputWrapper);
    this.repeatEmailWrapper = createLabel('wrapper', '', this.emailWrapper);
    this.confirmEmailInput = createInput({
      className: 'repeat-email',
      type: 'text',
      isActive: true,
      isRequired: true,
      placeholder: 'Repeat the e-mail',
      parentElement: this.repeatEmailWrapper,
    });
    this.rEmailErrorDiv = createDiv('error', this.repeatEmailWrapper);

    this.passwordInputWrapper = createLabel(
      'wrapper',
      '',
      this.userInfoWrapper
    );
    this.showHidePasswordBtn = createBtn(
      'show-hide-password',
      '🙈',
      this.passwordInputWrapper
    );
    this.passwordInput = createInput({
      className: 'password',
      type: 'password',
      isActive: true,
      isRequired: true,
      placeholder: 'Create a password',
      parentElement: this.passwordInputWrapper,
    });
    this.passwordErrorDiv = createDiv('error', this.passwordInputWrapper);
    this.repeatPasswordWrapper = createLabel(
      'wrapper',
      '',
      this.userInfoWrapper
    );
    this.repeatShowHidePasswordBtn = createBtn(
      'show-hide-password',
      '🙈',
      this.repeatPasswordWrapper
    );
    this.repeatPasswordInput = createInput({
      className: 'repeat-password',
      type: 'password',
      isActive: true,
      isRequired: true,
      placeholder: 'Repeat the password',
      parentElement: this.repeatPasswordWrapper,
    });

    this.rPasswordErrorDiv = createDiv('error', this.repeatPasswordWrapper);

    this.addressesHeading = createH3(
      'section-heading',
      'Address info',
      this.registerForm
    );
    this.addressesWrapper = createDiv('addresses-wrapper', this.registerForm);
    this.addressesWrapper.append(this.shippingAddressBlock.getAddresses());
    this.addressesWrapper.append(this.billingAddressBlock.getAddresses());

    this.loginWrapper = createDiv('login-wrapper', this.registerForm);
    this.loginWrapper.textContent = 'Already have an account? ';
    this.loginLink = createLocalLink(
      'login-link',
      'Sign In',
      Pages.LOGIN,
      () => router.navigateTo(Pages.LOGIN),
      this.loginWrapper
    );

    this.shippingAddressBlock.sameAsShippingCheckbox.addEventListener(
      'change',
      this.copyAddress.bind(this)
    );

    this.submitBtn = createBtn('register-btn', 'SIGN UP', this.registerForm);
    this.submitBtn.type = 'submit';
    this.submitBtn.disabled = true;
    this.registerForm.addEventListener('input', this.handleInput.bind(this));

    this.showHidePasswordBtn.addEventListener('click', (event) =>
      this.showHidePwd(event)
    );

    this.repeatShowHidePasswordBtn.addEventListener('click', (event) =>
      this.showHidePwd(event)
    );

    this.shippingAddressBlock.countryInput.addEventListener(
      'change',
      (event) => {
        const target: HTMLInputElement = event?.target as HTMLInputElement;
        const { value } = event.target as HTMLInputElement;
        const validateCountryOnChange = this.validateCountry.bind(this);
        validateCountryOnChange(value, target);
      }
    );
    this.billingAddressBlock.countryInput.addEventListener(
      'change',
      (event) => {
        const target: HTMLInputElement = event?.target as HTMLInputElement;
        const { value } = event.target as HTMLInputElement;
        const validateCountryOnChange = this.validateCountry.bind(this);
        validateCountryOnChange(value, target);
      }
    );
    this.registerForm.addEventListener(
      'submit',
      this.submitRegistration.bind(this)
    );
  }

  private handleInput(event: Event): void {
    const target: HTMLInputElement = event?.target as HTMLInputElement;
    if (target.className.includes('email')) {
      this.validateEmail(target.value);
    }
    if (target.className.includes('password')) {
      this.validatePassword(target.value);
    }
    if (
      target.className.includes('first-name') ||
      target.className.includes('last-name') ||
      target.className.includes('city')
    ) {
      if (target.parentElement) {
        this.validateNamesAndCity(target.value, target);
      }
    }
    if (target.className.includes('birth-date')) {
      this.validateDateOfBirth(target.value);
    }
    if (target.className.includes('post')) {
      this.validatePostalCode(target.value, target);
    }
    if (target.className.includes('country')) {
      this.validateCountry(target.value, target);
    }
    if (target.className.includes('repeat-email')) {
      this.validateRepeatEmail(target.value);
    }
    if (target.className.includes('repeat-password')) {
      this.validateRepeatPassword(target.value);
    }
    if (target.className.includes('street')) {
      this.validateStreet(target.value, target);
    }
  }

  private validateEmail(value: string): void {
    const template: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!template.test(value.trim())) {
      this.showInputStatus(this.emailInputWrapper, true, 'email');
      this.emailErrorDiv.textContent = ValidationErrors.EMAIL_ERR;
    } else {
      this.showInputStatus(this.emailInputWrapper, false, 'email');
      this.emailErrorDiv.textContent = '';
    }
    this.validateRepeatEmail(this.confirmEmailInput.value);
    this.checkAllInputs();
  }

  private validateRepeatEmail(value: string): void {
    if (value.trim() !== this.emailInput.value.trim()) {
      this.showInputStatus(this.repeatEmailWrapper, true, 'remail');
      this.rEmailErrorDiv.textContent = ValidationErrors.REPEAT_EMAIL_ERR;
    } else {
      this.showInputStatus(this.repeatEmailWrapper, false, 'remail');
      this.rEmailErrorDiv.textContent = '';
    }
    this.checkAllInputs();
  }

  private validatePassword(value: string): void {
    const template: RegExp =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!template.test(value) || value.trim() !== value) {
      this.showInputStatus(this.passwordInputWrapper, true, 'password');
      this.passwordErrorDiv.textContent = ValidationErrors.PASSWORD_ERR;
    } else {
      this.showInputStatus(this.passwordInputWrapper, false, 'password');
      this.passwordErrorDiv.textContent = '';
    }
    this.validateRepeatPassword(this.repeatPasswordInput.value);
    this.checkAllInputs();
  }

  private validateRepeatPassword(value: string): void {
    if (value !== this.passwordInput.value) {
      this.showInputStatus(this.repeatPasswordWrapper, true, 'rpassword');
      this.rPasswordErrorDiv.textContent = ValidationErrors.REPEAT_PASSWORD_ERR;
    } else {
      this.showInputStatus(this.repeatPasswordWrapper, false, 'rpassword');
      this.rPasswordErrorDiv.textContent = '';
    }
    this.checkAllInputs();
  }

  private validateNamesAndCity(value: string, target: EventTarget): void {
    const template: RegExp = /^[a-zA-Z]+$/;
    const targetEl: HTMLDivElement = target as HTMLDivElement;
    let isValidated: boolean = false;
    let activeBlock: AddressBlock;
    let addressType: keyof ValidationObj;

    if (target === this.shippingAddressBlock.cityInput) {
      activeBlock = this.shippingAddressBlock;
      addressType = 'sh_city';
    } else {
      activeBlock = this.billingAddressBlock;
      addressType = 'bi_city';
    }
    if (!template.test(value.trim())) {
      isValidated = false;
    } else {
      isValidated = true;
    }
    if (isValidated === true) {
      if (targetEl.classList.contains('first-name')) {
        this.areAllInputsValid.firstName = isValidated;
        this.showInputStatus(this.firstNameWrapper, false, 'firstName');
        this.firstNameErrorDiv.textContent = '';
      }
      if (targetEl.classList.contains('last-name')) {
        this.areAllInputsValid.lastName = isValidated;
        this.showInputStatus(this.lastNameWrapper, false, 'lastName');
        this.lastNameErrorDiv.textContent = '';
      }
      if (targetEl.classList.contains('city')) {
        this.areAllInputsValid[addressType] = isValidated;
        this.showInputStatus(activeBlock.cityWrapper, false, addressType);
        activeBlock.cityErrorDiv.textContent = '';
      }
    } else {
      if (targetEl.classList.contains('first-name')) {
        this.areAllInputsValid.firstName = isValidated;
        this.showInputStatus(this.firstNameWrapper, true, 'firstName');
        this.firstNameErrorDiv.textContent = ValidationErrors.NAMES_CITY_ERR;
      }
      if (targetEl.classList.contains('last-name')) {
        this.areAllInputsValid.lastName = isValidated;
        this.showInputStatus(this.lastNameWrapper, true, 'lastName');
        this.lastNameErrorDiv.textContent = ValidationErrors.NAMES_CITY_ERR;
      }
      if (targetEl.classList.contains('city')) {
        this.areAllInputsValid[addressType] = isValidated;
        this.showInputStatus(activeBlock.cityWrapper, true, addressType);
        activeBlock.cityErrorDiv.textContent = ValidationErrors.NAMES_CITY_ERR;
      }
    }
    this.checkAllInputs();
  }

  private validateDateOfBirth(value: string): void {
    const birthDate = new Date(value);
    const now = new Date();
    const minBirthDate = new Date(
      now.getFullYear() - MIN_AGE,
      now.getMonth(),
      now.getDate() + 1
    );
    if (birthDate >= minBirthDate) {
      this.showInputStatus(this.birthDateWrapper, true, 'birthDate');
      this.ageErrorDiv.textContent = ValidationErrors.AGE_ERR;
    } else {
      this.showInputStatus(this.birthDateWrapper, false, 'birthDate');
      this.ageErrorDiv.textContent = '';
    }
    this.checkAllInputs();
  }

  private validateCountry(value: string, target: HTMLInputElement): void {
    let datalist: HTMLDataListElement;
    let activeBlock: AddressBlock;
    let addressType: keyof ValidationObj;

    if (target === this.shippingAddressBlock.countryInput) {
      activeBlock = this.shippingAddressBlock;
      datalist = this.shippingAddressBlock.countryDataList;
      addressType = 'sh_country';
    } else {
      activeBlock = this.billingAddressBlock;
      datalist = this.billingAddressBlock.countryDataList;
      addressType = 'bi_country';
    }

    if (value.length > 0) {
      datalist.innerHTML = '';
      const suggestedCountries: string[] = postCodes
        .filter((el: PostalCodeObj) =>
          el.Country.toLowerCase().startsWith(value.toLowerCase())
        )
        .map((el: PostalCodeObj) => el.Country);

      suggestedCountries.forEach((el) => {
        const option: HTMLOptionElement = document.createElement('option');
        option.value = el;
        datalist.append(option);
      });
    }

    if (
      !postCodes.find(
        (el: PostalCodeObj) => el.Country.toLowerCase() === value.toLowerCase()
      )
    ) {
      this.showInputStatus(activeBlock.countryWrapper, true, addressType);
      activeBlock.postInput.placeholder = `Please enter a country`;
      activeBlock.postInput.value = '';
      activeBlock.postInput.disabled = true;
      activeBlock.countryErrorDiv.textContent = ValidationErrors.COUNTRY_ERR;
    } else {
      const codeFormat = postCodes.find(
        (el: PostalCodeObj) => el.Country.toLowerCase() === value.toLowerCase()
      );
      activeBlock.postInput.placeholder = `Postcode: ${codeFormat?.Format}`;
      this.showInputStatus(activeBlock.countryWrapper, false, addressType);
      if (codeFormat?.Format !== 'no codes') {
        activeBlock.postInput.disabled = false;
      }
      activeBlock.countryErrorDiv.textContent = '';
    }
    this.validatePostalCode(activeBlock.postInput.value, activeBlock.postInput);
    this.checkAllInputs();
  }

  private validatePostalCode(value: string, target: HTMLInputElement): void {
    let activeBlock: AddressBlock;
    let addressType: keyof ValidationObj;

    if (target === this.shippingAddressBlock.postInput) {
      activeBlock = this.shippingAddressBlock;
      addressType = 'sh_postCode';
    } else {
      activeBlock = this.billingAddressBlock;
      addressType = 'bi_postCode';
    }

    let pattern: RegExp = /^.*$/;
    const postObj: PostalCodeObj | undefined = postCodes.find(
      (el: PostalCodeObj) =>
        el.Country.toLowerCase() ===
        activeBlock.countryInput.value.toLowerCase()
    );
    if (postObj?.Format === 'no codes') {
      this.showInputStatus(activeBlock.postWrapper, false, addressType);
      activeBlock.postCodeErrorDiv.textContent = '';
      return;
    }
    if (postObj?.Regex) {
      pattern = postObj?.Regex !== '' ? new RegExp(postObj?.Regex) : /^.*$/;
    }
    if (!pattern.test(value) || value.length === 0) {
      this.showInputStatus(activeBlock.postWrapper, true, addressType);
      if (postObj?.Format) {
        activeBlock.postCodeErrorDiv.textContent = `${ValidationErrors.POSTCODE_ERR} ${postObj?.Format}`;
      } else {
        activeBlock.postCodeErrorDiv.textContent =
          ValidationErrors.POSTCODE_ERR;
      }
    } else {
      this.showInputStatus(activeBlock.postWrapper, false, addressType);
      activeBlock.postCodeErrorDiv.textContent = '';
    }
    this.checkAllInputs();
  }

  private validateStreet(value: string, target: HTMLInputElement): void {
    let activeBlock: AddressBlock;
    let addressType: keyof ValidationObj;

    if (target === this.shippingAddressBlock.streetInput) {
      activeBlock = this.shippingAddressBlock;
      addressType = 'sh_street';
    } else {
      activeBlock = this.billingAddressBlock;
      addressType = 'bi_street';
    }

    if (value.length < 1) {
      this.showInputStatus(activeBlock.streetWrapper, true, addressType);
      activeBlock.streetErrorDiv.textContent = ValidationErrors.STREET_ERR;
    } else {
      this.showInputStatus(activeBlock.streetWrapper, false, addressType);
      activeBlock.streetErrorDiv.textContent = '';
    }
    this.checkAllInputs();
  }

  private showInputStatus<K extends keyof ValidationObj>(
    input: HTMLInputElement | HTMLLabelElement | HTMLDivElement,
    isWrong: boolean,
    keyName: K
  ): void {
    if (isWrong) {
      this.areAllInputsValid[keyName] = false;
      input.classList.remove('valid-input');
      input.classList.remove('correct');
      input.classList.add('cross');
      input.classList.add('invalid-input');
    } else {
      this.areAllInputsValid[keyName] = true;
      input.classList.remove('cross');
      input.classList.remove('invalid-input');
      input.classList.add('correct');
      input.classList.add('valid-input');
    }
  }

  private copyAddress() {
    if (this.shippingAddressBlock.sameAsShippingCheckbox.checked === true) {
      this.shippingAddressBlock.defaultAddressLabel.remove();
      this.defaultShippingAddressLabel = createLabel(
        'default-shipping-address-label',
        'Set as default shipping address: '
      );
      this.defaultShippingAddressInput = createInput({
        className: 'default-shipping-address-input',
        type: 'checkbox',
        parentElement: this.defaultShippingAddressLabel,
      });
      this.defaultBillingAddressLabel = createLabel(
        'default-billing-address-label',
        'Set as default billing address: '
      );
      this.defaultBillingAddressInput = createInput({
        className: 'default-shipping-address-input',
        type: 'checkbox',
        parentElement: this.defaultBillingAddressLabel,
      });
      this.shippingAddressBlock.checkboxInputWrapper.prepend(
        this.defaultBillingAddressLabel
      );
      this.shippingAddressBlock.checkboxInputWrapper.prepend(
        this.defaultShippingAddressLabel
      );
      this.billingAddressBlock.addressWrapper.classList.add(
        'address-inputs-wrapper-hidden'
      );
      this.shippingAddressBlock.checkboxInputWrapper.classList.add(
        'same-addresses-checkbox'
      );
      this.areAllInputsValid.bi_country = true;
      this.areAllInputsValid.bi_postCode = true;
      this.areAllInputsValid.bi_city = true;
      this.areAllInputsValid.bi_street = true;
      this.billingAddressBlock.countryInput.disabled = true;
      this.billingAddressBlock.postInput.disabled = true;
      this.billingAddressBlock.cityInput.disabled = true;
      this.billingAddressBlock.streetInput.disabled = true;
      this.billingAddressBlock.countryInput.value =
        this.shippingAddressBlock.countryInput.value;
      this.billingAddressBlock.postInput.value =
        this.shippingAddressBlock.postInput.value;
      this.billingAddressBlock.cityInput.value =
        this.shippingAddressBlock.cityInput.value;
      this.billingAddressBlock.streetInput.value =
        this.shippingAddressBlock.streetInput.value;
      this.checkAllInputs();
    } else {
      this.defaultBillingAddressLabel?.remove();
      this.defaultShippingAddressLabel?.remove();
      this.shippingAddressBlock.checkboxInputWrapper.prepend(
        this.shippingAddressBlock.defaultAddressLabel
      );
      this.billingAddressBlock.addressWrapper.classList.remove(
        'address-inputs-wrapper-hidden'
      );
      this.shippingAddressBlock.checkboxInputWrapper.classList.remove(
        'same-addresses-checkbox'
      );
      this.areAllInputsValid.bi_country = false;
      this.areAllInputsValid.bi_postCode = false;
      this.areAllInputsValid.bi_city = false;
      this.areAllInputsValid.bi_street = false;
      this.billingAddressBlock.countryInput.disabled = false;
      this.billingAddressBlock.postInput.disabled = false;
      this.billingAddressBlock.cityInput.disabled = false;
      this.billingAddressBlock.streetInput.disabled = false;
      this.billingAddressBlock.countryInput.value = '';
      this.billingAddressBlock.postInput.value = '';
      this.billingAddressBlock.cityInput.value = '';
      this.billingAddressBlock.streetInput.value = '';
      this.checkAllInputs();
    }
  }

  private checkAllInputs() {
    const validationArr: boolean[] = Object.values(this.areAllInputsValid);
    if (
      validationArr.length === INPUT_FORM_COUNT &&
      validationArr.every((el) => el === true)
    ) {
      this.submitBtn.disabled = false;
    } else {
      this.submitBtn.disabled = true;
    }
  }

  private createUserObj(): UserInfo {
    let isDefaultShippingAddress =
      this.shippingAddressBlock.defaultAddressCheckbox.checked;
    let isDefaultBillingAddress =
      this.billingAddressBlock.defaultAddressCheckbox.checked;
    if (
      this.shippingAddressBlock.sameAsShippingCheckbox.checked &&
      this.defaultShippingAddressInput &&
      this.defaultBillingAddressInput
    ) {
      isDefaultShippingAddress = this.defaultShippingAddressInput.checked;
      isDefaultBillingAddress = this.defaultBillingAddressInput.checked;
    }
    const userObj: UserInfo = {
      email: this.emailInput.value,
      firstName: this.firstNameInput.value,
      lastName: this.lastNameInput.value,
      password: this.passwordInput.value,
      shippingAddress: {
        country: this.shippingAddressBlock.countryInput.value,
        postCode: this.shippingAddressBlock.postInput.value,
        city: this.shippingAddressBlock.cityInput.value,
        street: this.shippingAddressBlock.streetInput.value,
        isDefault: isDefaultShippingAddress,
        countryISO: getCountryISOCode(
          this.shippingAddressBlock.countryInput.value
        ),
      },
      billingAddress: {
        country: this.billingAddressBlock.countryInput.value,
        postCode: this.billingAddressBlock.postInput.value,
        city: this.billingAddressBlock.cityInput.value,
        street: this.billingAddressBlock.streetInput.value,
        isDefault: isDefaultBillingAddress,
        countryISO: getCountryISOCode(
          this.billingAddressBlock.countryInput.value
        ),
      },
    };
    return userObj;
  }

  private async submitRegistration(event: Event): Promise<void> {
    event.preventDefault();
    const userInfo: UserInfo = this.createUserObj();

    try {
      const userId = await signUpUser(userInfo);
      await addAddresses(userInfo, userId);
      this.router.navigateTo(Pages.MAIN);
      this.templatePage.getHeader().updateHeader();
    } catch (error) {
      this.handleRegistrationError();
    }
  }

  public handleRegistrationError(): void {
    this.registrationErrorPopup = createDiv('loginErrorPopup', document.body);
    const registrationErrorPopupContent = createDiv(
      'loginErrorPopupContent',
      this.registrationErrorPopup
    );
    const loginErrorPopupTop = createDiv(
      'loginErrorPopupTop',
      registrationErrorPopupContent
    );

    loginErrorPopupTop.innerHTML = '🐶🐶🐶';

    const loginErrorPopupBottom = createDiv(
      'loginErrorPopupBottom',
      registrationErrorPopupContent
    );
    loginErrorPopupBottom.innerHTML = `${'We have tried to register you but the e-mail you entered has already been registered. <br> Please enter another e-mail or sign in.'}`;
    this.registrationErrorPopup.addEventListener(
      'click',
      this.closeRegistrationErrorPopup.bind(this)
    );
  }

  private closeRegistrationErrorPopup() {
    if (this.registrationErrorPopup) {
      this.registrationErrorPopup.classList.add('hidden');
    }
    this.emailInput.value = '';
    this.passwordInput.value = '';
    this.repeatPasswordInput.value = '';
    this.confirmEmailInput.value = '';
  }

  private showHidePwd(event: Event) {
    event.preventDefault();

    if (this.passwordInput.type === 'password') {
      this.showHidePasswordBtn.textContent = '👀';
      this.repeatShowHidePasswordBtn.textContent = '👀';
      this.passwordInput.type = 'text';
      this.repeatPasswordInput.type = 'text';
    } else {
      this.showHidePasswordBtn.textContent = '🙈';
      this.repeatShowHidePasswordBtn.textContent = '🙈';
      this.passwordInput.type = 'password';
      this.repeatPasswordInput.type = 'password';
    }
  }
}

export default RegistrationPage;
