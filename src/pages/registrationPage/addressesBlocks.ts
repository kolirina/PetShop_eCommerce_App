import {
  createDiv,
  createInput,
  createLabel,
  createSpan,
} from '../../utils/elementCreator';

class AddressBlock {
  public streetInput: HTMLInputElement;

  public cityInput: HTMLInputElement;

  public postInput: HTMLInputElement;

  public countryInput: HTMLInputElement;

  public addressWrapper: HTMLLabelElement;

  public countryDataList: HTMLDataListElement;

  public countryWrapper: HTMLLabelElement;

  public postWrapper: HTMLLabelElement;

  public cityWrapper: HTMLLabelElement;

  public streetWrapper: HTMLLabelElement;

  protected shippingAddressText: HTMLSpanElement;

  protected checkboxInputWrapper: HTMLDivElement;

  protected defaultAddressLabel: HTMLLabelElement;

  public defaultAddressCheckbox: HTMLInputElement;

  protected sameAsShippingLabel: HTMLLabelElement;

  public sameAsShippingCheckbox: HTMLInputElement;

  public inputsWrapper: HTMLDivElement;

  public countryErrorDiv: HTMLDivElement;

  public postCodeErrorDiv: HTMLDivElement;

  public cityErrorDiv: HTMLDivElement;

  public streetErrorDiv: HTMLDivElement;

  constructor(addressType: string) {
    this.addressWrapper = createLabel('address-wrapper');
    this.shippingAddressText = createSpan(
      'address-type',
      `${addressType} address`,
      this.addressWrapper
    );
    this.inputsWrapper = createDiv(
      'address-inputs-wrapper',
      this.addressWrapper
    );
    this.countryWrapper = createLabel('wrapper', '', this.inputsWrapper);
    this.countryInput = createInput({
      className: 'country',
      type: 'text',
      isActive: true,
      isRequired: true,
      placeholder: 'Country',
      parentElement: this.countryWrapper,
    });
    if (addressType === 'Shipping') {
      this.countryInput.setAttribute('list', 'shipping-countries');
      this.countryDataList = document.createElement('datalist');
      this.countryDataList.id = 'shipping-countries';
      this.inputsWrapper.append(this.countryDataList);
    } else {
      this.countryInput.setAttribute('list', 'billing-countries');
      this.countryDataList = document.createElement('datalist');
      this.countryDataList.id = 'billing-countries';
      this.inputsWrapper.append(this.countryDataList);
    }
    this.countryErrorDiv = createDiv('error', this.countryWrapper);

    this.postWrapper = createLabel('wrapper', '', this.inputsWrapper);
    this.postInput = createInput({
      className: 'post',
      type: 'text',
      isActive: true,
      isRequired: true,
      placeholder: 'Please enter a country',
      parentElement: this.postWrapper,
    });
    this.postInput.disabled = true;
    this.postCodeErrorDiv = createDiv('error', this.postWrapper);

    this.cityWrapper = createLabel('wrapper', '', this.inputsWrapper);
    this.cityInput = createInput({
      className: 'city',
      type: 'text',
      isActive: true,
      isRequired: true,
      placeholder: 'City',
      parentElement: this.cityWrapper,
    });
    this.cityErrorDiv = createDiv('error', this.cityWrapper);

    this.streetWrapper = createLabel('wrapper', '', this.inputsWrapper);
    this.streetInput = createInput({
      className: 'street',
      type: 'text',
      isActive: true,
      isRequired: true,
      placeholder: 'Street',
      parentElement: this.streetWrapper,
    });
    this.streetErrorDiv = createDiv('error', this.streetWrapper);

    this.checkboxInputWrapper = createDiv(
      'check-inputs-wrapper',
      this.addressWrapper
    );
    this.defaultAddressLabel = createLabel(
      'default-address-label',
      'Set as default ',
      this.checkboxInputWrapper
    );
    this.defaultAddressCheckbox = createInput({
      className: 'default-address-input',
      type: 'checkbox',
      parentElement: this.defaultAddressLabel,
    });
    this.sameAsShippingLabel = createLabel(
      'same-address',
      'The addresses are the same: '
    );
    this.sameAsShippingCheckbox = createInput({
      className: 'same-address-input',
      type: 'checkbox',
    });
    if (addressType === 'Shipping') {
      this.sameAsShippingLabel.append(this.sameAsShippingCheckbox);
      this.checkboxInputWrapper.append(this.sameAsShippingLabel);
    }
  }

  public getAddresses() {
    return this.addressWrapper;
  }
}

export default AddressBlock;
