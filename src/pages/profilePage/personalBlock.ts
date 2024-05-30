import { Customer } from '@commercetools/platform-sdk';
import {
  createBtn,
  createDiv,
  createInput,
  createLabel,
} from '../../utils/elementCreator';
import styles from './profilePage.module.css';
import { ValidationObjPersonal } from '../../types';
import {
  checkAllInputs,
  validateDateOfBirth,
  validateOnlyAZ,
} from '../../utils/validateData';
import {
  setUsersDateOfBirth,
  setUsersFirstName,
  setUsersLastName,
} from '../../api/services';

export default class ProfilePersonalBlock {
  private userInfo: Customer;

  public blockWrapper: HTMLDivElement;

  public firstNameLabel: HTMLLabelElement;

  public firstNameInput: HTMLInputElement;

  public lastNameLabel: HTMLLabelElement;

  public lastNameInput: HTMLInputElement;

  public birthDateLabel: HTMLLabelElement;

  public birthDateInput: HTMLInputElement;

  public btnWrapper: HTMLDivElement;

  public resetBtn: HTMLButtonElement;

  public saveBtn: HTMLButtonElement;

  public areAllInputsValid: ValidationObjPersonal;

  constructor(userInfo: Customer) {
    this.userInfo = userInfo;

    this.areAllInputsValid = {
      firstName: false,
      lastName: false,
      birthDate: false,
    };

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

    this.btnWrapper = createDiv(styles.profileBtnWrapper, this.blockWrapper);
    this.saveBtn = createBtn(styles.profileBtn, 'Edit', this.btnWrapper);
    this.saveBtn.dataset.state = 'no-edit';
    this.resetBtn = createBtn(
      styles.profileBtn,
      'Reset changes',
      this.btnWrapper
    );
    // this.resetBtn.type = 'reset';
    this.resetBtn.disabled = true;

    this.saveBtn.addEventListener('click', this.switchEditMode.bind(this));
    this.resetBtn.addEventListener('click', this.exitEditMode.bind(this));
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

  private switchEditMode(e: Event) {
    e.preventDefault();
    if (this.saveBtn.dataset.state === 'no-edit') {
      this.saveBtn.dataset.state = 'edit';
      this.saveBtn.textContent = 'Save';
      this.resetBtn.disabled = false;
      this.firstNameInput.disabled = false;
      this.lastNameInput.disabled = false;
      this.birthDateInput.disabled = false;
    } else {
      let validationResult = validateOnlyAZ(this.firstNameInput.value);
      if (!validationResult) {
        this.showInputStatus(
          this.firstNameLabel,
          !validationResult,
          'firstName'
        );
      } else {
        this.showInputStatus(
          this.firstNameLabel,
          !validationResult,
          'firstName'
        );
      }

      validationResult = validateOnlyAZ(this.lastNameInput.value);
      if (!validationResult) {
        this.showInputStatus(this.lastNameLabel, !validationResult, 'lastName');
      } else {
        this.showInputStatus(this.lastNameLabel, !validationResult, 'lastName');
      }

      validationResult = validateDateOfBirth(this.birthDateInput.value);
      if (!validationResult) {
        this.showInputStatus(
          this.birthDateLabel,
          !validationResult,
          'birthDate'
        );
      } else {
        this.showInputStatus(
          this.birthDateLabel,
          !validationResult,
          'birthDate'
        );
      }
      if (checkAllInputs(this.areAllInputsValid)) {
        // console.log('good');
        this.exitEditMode();
        this.setUsersPersonalData();
      }
    }
  }

  private exitEditMode(e?: Event) {
    e?.preventDefault();
    const target: HTMLButtonElement = e?.target as HTMLButtonElement;
    this.saveBtn.dataset.state = 'no-edit';
    this.saveBtn.textContent = 'Edit';
    this.resetBtn.disabled = true;
    this.firstNameInput.disabled = true;
    this.lastNameInput.disabled = true;
    this.birthDateInput.disabled = true;

    if (target === this.resetBtn) {
      this.firstNameInput.value = this.userInfo.firstName
        ? this.userInfo.firstName
        : 'No data';
      this.lastNameInput.value = this.userInfo.lastName
        ? this.userInfo.lastName
        : 'No data';
      this.birthDateInput.value = this.userInfo.dateOfBirth
        ? this.userInfo.dateOfBirth
        : 'No data';
      this.firstNameInput.classList.value = styles.input;
      this.firstNameLabel.classList.value = styles.inputLabel;
      this.lastNameInput.classList.value = styles.input;
      this.lastNameLabel.classList.value = styles.inputLabel;
      this.birthDateInput.classList.value = styles.input;
      this.birthDateLabel.classList.value = styles.inputLabel;
    }
  }

  public showInputStatus<K extends keyof ValidationObjPersonal>(
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

  public setUsersPersonalData() {
    setUsersFirstName(this.firstNameInput.value, this.userInfo.id).then(() =>
      setUsersLastName(this.lastNameInput.value, this.userInfo.id).then(() =>
        setUsersDateOfBirth(this.birthDateInput.value, this.userInfo.id)
      )
    );
  }
}
