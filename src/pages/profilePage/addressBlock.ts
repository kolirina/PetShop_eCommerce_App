import { Address } from '@commercetools/platform-sdk';
import {
  createBtn,
  createDiv,
  createInput,
  createLabel,
} from '../../utils/elementCreator';
import postCodes from '../../assets/data/postal-codes';
import {
  AddressToChange,
  PostalCodeObj,
  ValidationObjAddresses,
} from '../../types';
import {
  checkAllInputs,
  validateAZAndNum,
  validateCountry,
  validatePostalCode,
  validateStreetNum,
} from '../../utils/validateData';
import { ValidationErrors } from '../registrationPage/constants';
import {
  getCountryISOCode,
  getCountryFromISO,
} from '../../utils/getCountryISO';
import { changeUsersAddress } from '../../api/services';
import { NO_INFO, REMOVE_TIMEOUT } from './constants';
import styles from './profilePage.module.css';

export default class ProfileAddressBlock {
  public address: Address;

  public addressId: string;

  public userId: string;

  public blockWrapper: HTMLDivElement;

  public areAllInputsValid: ValidationObjAddresses;

  public countryLabel: HTMLLabelElement;

  public countryInput: HTMLInputElement;

  public countryDataList: HTMLDataListElement;

  public postCodeLabel: HTMLLabelElement;

  public postCodeInput: HTMLInputElement;

  public cityLabel: HTMLLabelElement;

  public cityInput: HTMLInputElement;

  public streetLabel: HTMLLabelElement;

  public streetInput: HTMLInputElement;

  public streetNumberLabel: HTMLLabelElement;

  public streetNumberInput: HTMLInputElement;

  public checkboxWrapper: HTMLDivElement;

  public defaultShippingAddressLabel: HTMLLabelElement;

  public defaultShippingAddressInput: HTMLInputElement;

  public defaultBillingAddressLabel: HTMLLabelElement;

  public defaultBillingAddressInput: HTMLInputElement;

  public btnWrapper: HTMLDivElement;

  public resetBtn: HTMLButtonElement;

  public saveBtn: HTMLButtonElement;

  public deleteBtn: HTMLButtonElement;

  public countryErrorDiv: HTMLDivElement;

  public postCodeErrorDiv: HTMLDivElement;

  public cityErrorDiv: HTMLDivElement;

  public streetErrorDiv: HTMLDivElement;

  public streetNumErrorDiv: HTMLDivElement;

  public addressChangeResult: HTMLDivElement;

  public defaultShippingAddress: string;

  public defaultBillingAddress: string;

  constructor(
    address: Address,
    defaultBilling: string,
    defaultShipping: string,
    userId: string
  ) {
    this.areAllInputsValid = {
      country: false,
      postalCode: false,
      city: false,
      street: false,
      streetNum: false,
    };
    this.address = address;
    this.addressId = address.id ? address.id : '';
    this.userId = userId;
    this.defaultShippingAddress = defaultShipping;
    this.defaultBillingAddress = defaultBilling;

    this.blockWrapper = createDiv(styles.inputsWrapper);
    this.countryLabel = createLabel(
      styles.inputLabel,
      'Country:',
      this.blockWrapper
    );
    this.countryInput = createInput({
      className: styles.input,
      type: 'text',
      isActive: false,
      parentElement: this.countryLabel,
    });
    this.countryInput.setAttribute('list', 'countries');
    this.countryDataList = document.createElement('datalist');
    this.countryDataList.id = 'countries';
    this.countryLabel.append(this.countryDataList);
    this.countryErrorDiv = createDiv(styles.error, this.countryLabel);

    this.postCodeLabel = createLabel(
      styles.inputLabel,
      'Postal code:',
      this.blockWrapper
    );
    this.postCodeInput = createInput({
      className: styles.input,
      type: 'text',
      isActive: false,
      parentElement: this.postCodeLabel,
    });
    this.postCodeErrorDiv = createDiv(styles.error, this.postCodeLabel);

    this.cityLabel = createLabel(styles.inputLabel, 'City:', this.blockWrapper);
    this.cityInput = createInput({
      className: styles.input,
      type: 'text',
      isActive: false,
      isRequired: true,
      parentElement: this.cityLabel,
    });
    this.cityErrorDiv = createDiv(styles.error, this.cityLabel);

    this.streetLabel = createLabel(
      styles.inputLabel,
      'Street:',
      this.blockWrapper
    );
    this.streetInput = createInput({
      className: styles.input,
      type: 'text',
      isActive: false,
      parentElement: this.streetLabel,
    });
    this.streetErrorDiv = createDiv(styles.error, this.streetLabel);

    this.streetNumberLabel = createLabel(
      styles.inputLabel,
      'House number:',
      this.blockWrapper
    );
    this.streetNumberInput = createInput({
      className: styles.input,
      type: 'text',
      isActive: false,
      parentElement: this.streetNumberLabel,
    });
    this.streetNumErrorDiv = createDiv(styles.error, this.streetNumberLabel);

    this.checkboxWrapper = createDiv(styles.checkboxWrapper, this.blockWrapper);
    this.defaultShippingAddressLabel = createLabel(
      styles.checkboxLabel,
      'Default shipping address: ',
      this.checkboxWrapper
    );
    this.defaultShippingAddressInput = createInput({
      className: styles.checkbox,
      type: 'checkbox',
      isActive: false,
      parentElement: this.defaultShippingAddressLabel,
    });

    this.defaultBillingAddressLabel = createLabel(
      styles.checkboxLabel,
      'Default billing address: ',
      this.checkboxWrapper
    );
    this.defaultBillingAddressInput = createInput({
      className: styles.checkbox,
      type: 'checkbox',
      isActive: false,
      parentElement: this.defaultBillingAddressLabel,
    });

    this.countryInput.value = getCountryFromISO(address.country);
    if (!address.postalCode) {
      this.postCodeInput.placeholder = NO_INFO;
    } else {
      this.postCodeInput.value = address.postalCode;
    }
    if (!address.city) {
      this.cityInput.placeholder = NO_INFO;
    } else {
      this.cityInput.value = address.city;
    }
    if (!address.streetName) {
      this.streetInput.placeholder = NO_INFO;
    } else {
      this.streetInput.value = address.streetName;
    }
    if (!address.streetNumber) {
      this.streetNumberInput.placeholder = NO_INFO;
    } else {
      this.streetNumberInput.value = address.streetNumber;
    }

    if (address.id === defaultShipping) {
      this.defaultShippingAddressInput.checked = true;
    }
    if (address.id === defaultBilling) {
      this.defaultBillingAddressInput.checked = true;
    }

    this.btnWrapper = createDiv(styles.profileBtnWrapper, this.blockWrapper);
    this.saveBtn = createBtn(styles.profileBtn, 'Edit', this.btnWrapper);
    this.saveBtn.dataset.state = 'no-edit';
    this.resetBtn = createBtn(
      styles.profileBtn,
      'Reset changes',
      this.btnWrapper
    );
    this.resetBtn.disabled = true;

    this.deleteBtn = createBtn(
      styles.deleteBtn,
      'Delete address',
      this.blockWrapper
    );

    this.addressChangeResult = createDiv(styles.addressChangeResultOk);

    this.countryInput.addEventListener(
      'change',
      this.countryAutoFill.bind(this)
    );
    this.countryInput.addEventListener(
      'input',
      this.countryAutoFill.bind(this)
    );
    this.saveBtn.addEventListener('click', this.switchEditMode.bind(this));
    this.resetBtn.addEventListener('click', this.exitEditMode.bind(this));
  }

  public getBlock() {
    return this.blockWrapper;
  }

  private countryAutoFill() {
    if (this.countryInput.value.length > 0) {
      this.countryDataList.innerHTML = '';
      const suggestedCountries: string[] = postCodes
        .filter((el: PostalCodeObj) =>
          el.Country.toLowerCase().startsWith(
            this.countryInput.value.toLowerCase()
          )
        )
        .map((el: PostalCodeObj) => el.Country);

      suggestedCountries.forEach((el) => {
        const option: HTMLOptionElement = document.createElement('option');
        option.value = el;
        this.countryDataList.append(option);
      });
    }
  }

  private switchEditMode(e: Event): void {
    e.preventDefault();

    if (this.saveBtn.dataset.state === 'no-edit') {
      this.saveBtn.dataset.state = 'edit';
      this.saveBtn.textContent = 'Save';
      this.resetBtn.disabled = false;
      this.countryInput.disabled = false;
      this.postCodeInput.disabled = false;
      this.cityInput.disabled = false;
      this.streetInput.disabled = false;
      this.streetNumberInput.disabled = false;
      this.defaultShippingAddressInput.disabled = false;
      this.defaultBillingAddressInput.disabled = false;
    } else {
      this.validateCountryInput();
      this.validatePostalCodeInput();
      this.validateCityInput();
      this.validateStreetInput();
      this.validateStreetNumInput();
      if (checkAllInputs(this.areAllInputsValid)) {
        this.saveBtn.textContent = 'Edit';
        this.resetBtn.disabled = true;
        this.countryInput.disabled = true;
        this.postCodeInput.disabled = true;
        this.cityInput.disabled = true;
        this.streetInput.disabled = true;
        this.streetNumberInput.disabled = true;
        this.exitEditMode();
        this.changeAddress();
      }
    }
  }

  private validateCountryInput() {
    const validationRes = validateCountry(this.countryInput.value);
    this.showInputStatus(this.countryLabel, !validationRes, 'country');
    if (!validationRes) {
      this.countryErrorDiv.textContent = ValidationErrors.COUNTRY_ERR;
    } else {
      this.countryErrorDiv.textContent = '';
    }
  }

  private validatePostalCodeInput() {
    const validationRes = validatePostalCode(
      this.postCodeInput.value,
      this.countryInput.value
    );
    if (validationRes === 'no codes') {
      this.postCodeErrorDiv.textContent = '';
      this.postCodeInput.value = validationRes;
      this.postCodeInput.disabled = true;
      this.showInputStatus(this.postCodeLabel, false, 'postalCode');
    }
    if (validationRes === 'no_country') {
      this.postCodeErrorDiv.textContent = ValidationErrors.NO_COUNTRY;
      this.postCodeInput.placeholder = 'Enter a country';
      this.showInputStatus(this.postCodeLabel, true, 'postalCode');
    }
    if (
      typeof validationRes === 'string' &&
      validationRes !== 'no_country' &&
      validationRes !== 'no codes'
    ) {
      this.postCodeErrorDiv.textContent = `${ValidationErrors.POSTCODE_ERR}. Format: ${validationRes}`;
      this.showInputStatus(this.postCodeLabel, true, 'postalCode');
    }
    if (validationRes === true) {
      this.showInputStatus(this.postCodeLabel, false, 'postalCode');
      this.postCodeErrorDiv.textContent = '';
    }
  }

  private validateCityInput() {
    const validationRes = validateAZAndNum(this.cityInput.value);
    this.showInputStatus(this.cityLabel, !validationRes, 'city');
    if (!validationRes) {
      this.cityErrorDiv.textContent = ValidationErrors.NAMES_CITY_ERR;
    } else {
      this.cityErrorDiv.textContent = '';
    }
  }

  private validateStreetInput() {
    const validationRes = validateAZAndNum(this.streetInput.value);
    this.showInputStatus(this.streetLabel, !validationRes, 'street');
    if (!validationRes) {
      this.streetErrorDiv.textContent = ValidationErrors.NAMES_CITY_ERR;
    } else {
      this.streetErrorDiv.textContent = '';
    }
  }

  private validateStreetNumInput() {
    const validationRes = validateStreetNum(this.streetNumberInput.value);
    this.showInputStatus(this.streetNumberLabel, !validationRes, 'streetNum');
    if (!validationRes) {
      this.streetNumErrorDiv.textContent = ValidationErrors.NAMES_CITY_ERR;
    } else {
      this.streetNumErrorDiv.textContent = '';
    }
  }

  public showInputStatus<K extends keyof ValidationObjAddresses>(
    input: HTMLInputElement | HTMLLabelElement | HTMLDivElement,
    isWrong: boolean,
    keyName: K
  ): void {
    if (isWrong) {
      this.areAllInputsValid[keyName] = false;
      input.firstElementChild?.classList.remove(styles.validInput);
      input.classList.remove(styles.correct);
      input.classList.add(styles.cross);
      input.firstElementChild?.classList.add(styles.invalidInput);
    } else {
      this.areAllInputsValid[keyName] = true;
      input.classList.remove(styles.cross);
      input.firstElementChild?.classList.remove(styles.invalidInput);
      input.classList.add(styles.correct);
      input.firstElementChild?.classList.add(styles.validInput);
    }
  }

  private exitEditMode(e?: Event) {
    e?.preventDefault();
    const target: HTMLButtonElement = e?.target as HTMLButtonElement;
    this.saveBtn.dataset.state = 'no-edit';
    this.saveBtn.textContent = 'Edit';
    this.resetBtn.disabled = true;
    this.countryInput.disabled = true;
    this.postCodeInput.disabled = true;
    this.cityInput.disabled = true;
    this.streetInput.disabled = true;
    this.streetNumberInput.disabled = true;
    this.countryErrorDiv.textContent = '';
    this.postCodeErrorDiv.textContent = '';
    this.cityErrorDiv.textContent = '';
    this.streetErrorDiv.textContent = '';
    this.streetNumErrorDiv.textContent = '';
    this.defaultBillingAddressInput.disabled = true;
    this.defaultShippingAddressInput.disabled = true;

    if (target === this.resetBtn) {
      this.countryInput.value = this.address.country
        ? getCountryFromISO(this.address.country)
        : 'No data';
      this.postCodeInput.value = this.address.postalCode
        ? this.address.postalCode
        : 'No data';
      this.cityInput.value = this.address.city ? this.address.city : 'No data';
      this.streetInput.value = this.address.streetName
        ? this.address.streetName
        : 'No data';
      this.streetNumberInput.value = this.address.streetNumber
        ? this.address.streetNumber
        : 'No data';
      this.countryInput.classList.value = styles.input;
      this.countryLabel.classList.value = styles.inputLabel;
      this.postCodeInput.classList.value = styles.input;
      this.postCodeLabel.classList.value = styles.inputLabel;
      this.cityInput.classList.value = styles.input;
      this.cityLabel.classList.value = styles.inputLabel;
      this.streetInput.classList.value = styles.input;
      this.streetLabel.classList.value = styles.inputLabel;
      this.streetNumberInput.classList.value = styles.input;
      this.streetNumberLabel.classList.value = styles.inputLabel;
      this.defaultShippingAddressInput.checked =
        this.addressId === this.defaultShippingAddress;
      this.defaultBillingAddressInput.checked =
        this.addressId === this.defaultBillingAddress;
    }
  }

  private changeAddress() {
    const address: AddressToChange = {
      country: getCountryISOCode(this.countryInput.value),
      postalCode:
        this.postCodeInput.value !== 'no codes' ? this.postCodeInput.value : '',
      city: this.cityInput.value,
      streetName: this.streetInput.value,
      streetNumber: this.streetNumberInput.value,
    };

    changeUsersAddress(this.addressId, address, this.userId)
      .then(() => {
        this.blockWrapper.append(this.addressChangeResult);
        this.addressChangeResult.classList.add(styles.changeResultOk);
        this.addressChangeResult.classList.remove(styles.changeResultFalse);
        this.addressChangeResult.textContent =
          'The address has been changed successfully.';
        setTimeout(() => {
          this.addressChangeResult.remove();
        }, REMOVE_TIMEOUT);
      })
      .catch(() => {
        this.blockWrapper.append(this.addressChangeResult);
        this.addressChangeResult.classList.remove(styles.changeResultOk);
        this.addressChangeResult.classList.add(styles.changeResultFalse);
        this.addressChangeResult.textContent =
          "The address hasn't been changed.";
        setTimeout(() => {
          this.addressChangeResult.remove();
        }, REMOVE_TIMEOUT);
      });
  }
}
