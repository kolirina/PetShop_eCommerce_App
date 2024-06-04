import { Customer } from '@commercetools/platform-sdk';
import {
  createBtn,
  createDiv,
  createInput,
  createLabel,
} from '../../utils/elementCreator';
import { validateEmail, validatePassword } from '../../utils/validateData';
import { ValidationErrors } from '../registrationPage/constants';
import { changeUsersEmail, changeUsersPassword } from '../../api/services';
import { REMOVE_TIMEOUT } from './constants';
import styles from './profilePage.module.css';

function showInputStatus(
  input: HTMLInputElement | HTMLLabelElement | HTMLDivElement,
  isWrong: boolean
): void {
  if (isWrong) {
    input.firstElementChild?.classList.remove(styles.validInput);
    input.classList.remove(styles.correct);
    input.classList.add(styles.cross);
    input.firstElementChild?.classList.add(styles.invalidInput);
  } else {
    input.classList.remove(styles.cross);
    input.firstElementChild?.classList.remove(styles.invalidInput);
    input.classList.add(styles.correct);
    input.firstElementChild?.classList.add(styles.validInput);
  }
}

export default class ProfileAccountBlock {
  private userInfo: Customer;

  public blockWrapper: HTMLDivElement;

  public emailLabel: HTMLLabelElement;

  public emailInput: HTMLInputElement;

  public emailErrorDiv: HTMLDivElement;

  public emailBtnsWrapper: HTMLDivElement;

  public emailSaveBtn: HTMLButtonElement;

  public emailResetBtn: HTMLButtonElement;

  public emailChangeResults: HTMLDivElement;

  public passwordLabel: HTMLLabelElement;

  public passwordInput: HTMLInputElement;

  public prevPasswordLabel: HTMLLabelElement;

  public prevPasswordInput: HTMLInputElement;

  public prevPasswordErrorDiv: HTMLDivElement;

  public passwordErrorDiv: HTMLDivElement;

  public passwordBtnsWrapper: HTMLDivElement;

  public passwordSaveBtn: HTMLButtonElement;

  public passwordResetBtn: HTMLButtonElement;

  public passwordChangeResults: HTMLDivElement;

  constructor(userInfo: Customer) {
    this.userInfo = userInfo;

    this.blockWrapper = createDiv(styles.inputsWrapper);

    this.emailLabel = createLabel(
      styles.inputLabel,
      'E-mail:',
      this.blockWrapper
    );
    this.emailInput = createInput({
      className: styles.input,
      type: 'text',
      isActive: false,
      parentElement: this.emailLabel,
    });
    this.emailInput.value = this.userInfo.email;
    this.emailErrorDiv = createDiv(styles.error, this.emailLabel);

    this.emailBtnsWrapper = createDiv(
      styles.profileBtnWrapperEmail,
      this.emailLabel
    );
    this.emailSaveBtn = createBtn(
      styles.profileBtn,
      'Edit e-mail',
      this.emailBtnsWrapper
    );
    this.emailSaveBtn.dataset.state = 'no-edit';
    this.emailResetBtn = createBtn(
      styles.profileBtn,
      'Reset changes',
      this.emailBtnsWrapper
    );
    this.emailResetBtn.disabled = true;

    this.emailChangeResults = createDiv(styles.accountChangeResultOk);

    this.prevPasswordLabel = createLabel(
      styles.currentInputLabel,
      'Current password:'
    );
    this.prevPasswordInput = createInput({
      className: styles.input,
      type: 'password',
      isActive: true,
      parentElement: this.prevPasswordLabel,
    });
    this.prevPasswordErrorDiv = createDiv(styles.error, this.prevPasswordLabel);

    this.passwordLabel = createLabel(
      styles.inputLabel,
      'New password:',
      this.blockWrapper
    );
    this.passwordInput = createInput({
      className: styles.input,
      type: 'password',
      isActive: false,
      parentElement: this.passwordLabel,
    });
    this.passwordInput.value = '';
    this.passwordErrorDiv = createDiv(styles.error, this.passwordLabel);

    this.passwordBtnsWrapper = createDiv(
      styles.profileBtnWrapperPwd,
      this.passwordLabel
    );
    this.passwordSaveBtn = createBtn(
      styles.profileBtn,
      'Change',
      this.passwordBtnsWrapper
    );
    this.passwordSaveBtn.dataset.state = 'no-edit';
    this.passwordResetBtn = createBtn(
      styles.profileBtn,
      'Cancel',
      this.passwordBtnsWrapper
    );
    this.passwordResetBtn.disabled = true;

    this.passwordChangeResults = createDiv(styles.accountChangeResultOk);

    this.emailSaveBtn.addEventListener(
      'click',
      this.switchEmailEditMode.bind(this)
    );
    this.emailResetBtn.addEventListener(
      'click',
      this.exitEmailEditMode.bind(this)
    );

    this.passwordSaveBtn.addEventListener(
      'click',
      this.switchPasswordEditMode.bind(this)
    );
    this.passwordResetBtn.addEventListener(
      'click',
      this.exitPasswordEditMode.bind(this)
    );
  }

  public getBlock() {
    return this.blockWrapper;
  }

  private switchEmailEditMode(e: Event): void {
    e.preventDefault();

    if (this.emailSaveBtn.dataset.state === 'no-edit') {
      this.emailSaveBtn.dataset.state = 'edit';
      this.emailSaveBtn.textContent = 'Save';
      this.emailResetBtn.disabled = false;
      this.emailInput.disabled = false;
    } else if (this.validateEmailInput()) {
      this.emailSaveBtn.textContent = 'Edit';
      this.emailResetBtn.disabled = true;
      this.emailInput.disabled = true;
      this.exitEmailEditMode();
      this.changeEmail();
    }
  }

  private switchPasswordEditMode(e: Event): void {
    e.preventDefault();

    if (this.passwordSaveBtn.dataset.state === 'no-edit') {
      this.passwordSaveBtn.dataset.state = 'edit';
      this.passwordSaveBtn.textContent = 'Save';
      this.passwordResetBtn.disabled = false;
      this.passwordInput.disabled = false;
      this.blockWrapper.insertBefore(
        this.prevPasswordLabel,
        this.passwordLabel
      );
    } else {
      const areAllInputsValid = {
        curPwd: false,
        newPwd: false,
      };
      areAllInputsValid.newPwd = this.validatePasswordInput(
        this.passwordInput.value,
        this.passwordLabel
      );
      areAllInputsValid.curPwd = this.validatePasswordInput(
        this.prevPasswordInput.value,
        this.prevPasswordLabel
      );
      if (Object.values(areAllInputsValid).every((el) => el === true)) {
        this.passwordSaveBtn.textContent = 'Edit';
        this.passwordResetBtn.disabled = true;
        this.passwordInput.disabled = true;
        this.changePassword();
        this.exitPasswordEditMode();
      }
    }
  }

  private validateEmailInput(): boolean {
    const validationRes = validateEmail(this.emailInput.value);
    showInputStatus(this.emailLabel, !validationRes);
    if (!validationRes) {
      this.emailErrorDiv.textContent = ValidationErrors.EMAIL_ERR;
      return false;
    }
    this.emailErrorDiv.textContent = '';
    return true;
  }

  private validatePasswordInput(
    value: string,
    elToShowStatus: HTMLLabelElement
  ): boolean {
    const validationRes = validatePassword(value);
    showInputStatus(elToShowStatus, !validationRes);
    if (!validationRes) {
      if (elToShowStatus === this.passwordLabel) {
        this.passwordErrorDiv.textContent = ValidationErrors.PASSWORD_ERR;
      }
      if (elToShowStatus === this.prevPasswordLabel) {
        this.prevPasswordErrorDiv.textContent = ValidationErrors.PASSWORD_ERR;
      }
      return false;
    }
    if (elToShowStatus === this.passwordLabel) {
      this.passwordErrorDiv.textContent = '';
    }
    if (elToShowStatus === this.prevPasswordLabel) {
      this.prevPasswordErrorDiv.textContent = '';
    }
    return true;
  }

  private changeEmail() {
    changeUsersEmail(this.emailInput.value, this.userInfo.id)
      .then(() => {
        this.emailLabel.append(this.emailChangeResults);
        this.emailChangeResults.classList.add(styles.accountChangeResultOk);
        this.emailChangeResults.classList.remove(
          styles.accountChangeResultFalse
        );
        this.emailChangeResults.textContent =
          'The e-mail has been changed successfully.';
        setTimeout(() => {
          this.emailChangeResults.remove();
        }, REMOVE_TIMEOUT);
      })
      .catch(() => {
        this.emailLabel.append(this.emailChangeResults);
        this.emailChangeResults.classList.remove(styles.accountChangeResultOk);
        this.emailChangeResults.classList.add(styles.accountChangeResultFalse);
        this.emailChangeResults.textContent = "The e-mail hasn't been changed.";
        setTimeout(() => {
          this.emailChangeResults.remove();
        }, REMOVE_TIMEOUT);
      });
  }

  private changePassword() {
    changeUsersPassword(
      this.prevPasswordInput.value,
      this.passwordInput.value,
      this.userInfo.id
    )
      .then(() => {
        this.passwordLabel.append(this.passwordChangeResults);
        this.passwordChangeResults.classList.add(styles.accountChangeResultOk);
        this.passwordChangeResults.classList.remove(
          styles.accountChangeResultFalse
        );
        this.passwordChangeResults.textContent =
          'The password has been changed successfully.';
        setTimeout(() => {
          this.passwordChangeResults.remove();
        }, REMOVE_TIMEOUT);
      })
      .catch(() => {
        this.passwordLabel.append(this.passwordChangeResults);
        this.passwordChangeResults.classList.remove(
          styles.accountChangeResultOk
        );
        this.passwordChangeResults.classList.add(
          styles.accountChangeResultFalse
        );
        this.passwordChangeResults.textContent =
          "The password hasn't been changed.";
        setTimeout(() => {
          this.passwordChangeResults.remove();
        }, REMOVE_TIMEOUT);
      });
  }

  public exitEmailEditMode(e?: Event) {
    e?.preventDefault();

    const target: HTMLButtonElement = e?.target as HTMLButtonElement;
    this.emailSaveBtn.dataset.state = 'no-edit';
    this.emailSaveBtn.textContent = 'Edit';
    this.emailResetBtn.disabled = true;
    this.emailErrorDiv.textContent = '';
    this.emailInput.disabled = true;
    this.emailLabel.classList.remove(styles.correct);
    this.emailInput.classList.remove(styles.validInput);

    if (target === this.emailResetBtn) {
      this.emailInput.value = this.userInfo.email;
      this.emailInput.classList.value = styles.input;
      this.emailLabel.classList.value = styles.inputLabel;
    }
  }

  public exitPasswordEditMode(e?: Event) {
    e?.preventDefault();

    const target: HTMLButtonElement = e?.target as HTMLButtonElement;
    this.passwordSaveBtn.dataset.state = 'no-edit';
    this.passwordSaveBtn.textContent = 'Change';
    this.passwordResetBtn.disabled = true;
    this.passwordErrorDiv.textContent = '';
    this.passwordInput.disabled = true;
    this.passwordInput.value = '';
    this.prevPasswordInput.value = '';
    this.prevPasswordLabel.classList.remove(styles.correct);
    this.prevPasswordInput.classList.remove(styles.validInput);
    this.passwordLabel.classList.remove(styles.correct);
    this.passwordInput.classList.remove(styles.validInput);
    this.prevPasswordLabel.remove();

    if (target === this.passwordResetBtn) {
      this.passwordInput.value = '';
      this.passwordInput.classList.value = styles.input;
      this.passwordLabel.classList.value = styles.inputLabel;
      this.prevPasswordLabel.remove();
    }
  }
}
