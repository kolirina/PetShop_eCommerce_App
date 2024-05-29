import {
  createDiv,
  createInput,
  createLabel,
} from '../../utils/elementCreator';
import styles from './profilePage.module.css';

export default class ProfilePersonalBlock {
  public blockWrapper: HTMLDivElement;

  public firstNameLabel: HTMLLabelElement;

  public firstNameInput: HTMLInputElement;

  public lastNameLabel: HTMLLabelElement;

  public lastNameInput: HTMLInputElement;

  public birthDateLabel: HTMLLabelElement;

  public birthDateInput: HTMLInputElement;

  constructor() {
    this.blockWrapper = createDiv(styles.inputsWrapper);
    this.firstNameLabel = createLabel(
      styles.inputLabel,
      'First name:',
      this.blockWrapper
    );
    this.firstNameInput = createInput({
      className: styles.input,
      type: 'text',
      isActive: false,
      parentElement: this.firstNameLabel,
    });
    this.lastNameLabel = createLabel(
      styles.inputLabel,
      'Last name:',
      this.blockWrapper
    );
    this.lastNameInput = createInput({
      className: styles.input,
      type: 'text',
      isActive: false,
      parentElement: this.lastNameLabel,
    });

    this.birthDateLabel = createLabel(
      styles.inputLabel,
      'Date of birth:',
      this.blockWrapper
    );
    this.birthDateInput = createInput({
      className: styles.input,
      type: 'date',
      isActive: false,
      isRequired: true,
      parentElement: this.birthDateLabel,
    });
  }

  public setFirstName(value: string) {
    this.firstNameInput.value = value;
  }

  public setLastName(value: string) {
    this.lastNameInput.value = value;
  }

  public setDateOfBirth(value: string) {
    this.birthDateInput.value = value;
  }

  public getBlock() {
    return this.blockWrapper;
  }
}
