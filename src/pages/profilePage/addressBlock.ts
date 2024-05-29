import { Address } from '@commercetools/platform-sdk';
import {
  createDiv,
  createInput,
  createLabel,
} from '../../utils/elementCreator';
import styles from './profilePage.module.css';
import postCodes from '../../assets/data/postal-codes';
import { PostalCodeObj } from '../../types';

function getCountryFromISO(iso: string): string {
  const countryObj = postCodes.find(
    (el: PostalCodeObj) => iso.toLowerCase() === el.ISO.toLowerCase()
  );
  const country = countryObj?.Country ? countryObj.Country : '';
  return country;
}

export default class ProfileAddressBlock {
  public blockWrapper: HTMLDivElement;

  public countryLabel: HTMLLabelElement;

  public countryInput: HTMLInputElement;

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

  constructor(
    address: Address,
    defaultBilling: string,
    defaultShipping: string
  ) {
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

    this.cityLabel = createLabel(styles.inputLabel, 'City:', this.blockWrapper);
    this.cityInput = createInput({
      className: styles.input,
      type: 'text',
      isActive: false,
      isRequired: true,
      parentElement: this.cityLabel,
    });

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

    this.streetNumberLabel = createLabel(
      styles.inputLabel,
      'Street number:',
      this.blockWrapper
    );
    this.streetNumberInput = createInput({
      className: styles.input,
      type: 'text',
      isActive: false,
      parentElement: this.streetNumberLabel,
    });

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
    this.postCodeInput.value = address.postalCode
      ? address.postalCode
      : 'Not added...';
    this.cityInput.value = address.city ? address.city : 'Not added...';
    this.streetInput.value = address.streetName
      ? address.streetName
      : 'Not added...';
    this.streetNumberInput.value = address.streetNumber
      ? address.streetNumber
      : 'Not added...';

    if (address.id === defaultShipping) {
      this.defaultShippingAddressInput.checked = true;
    }
    if (address.id === defaultBilling) {
      this.defaultBillingAddressInput.checked = true;
    }
  }

  public setCountry(value: string) {
    this.countryInput.value = value;
  }

  public setPostalCode(value: string) {
    this.postCodeInput.value = value;
  }

  public setCity(value: string) {
    this.cityInput.value = value;
  }

  public setStreet(value: string) {
    this.streetInput.value = value;
  }

  public getBlock() {
    return this.blockWrapper;
  }
}
