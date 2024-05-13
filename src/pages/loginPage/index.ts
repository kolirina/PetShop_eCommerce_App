import Router from '../../router';
import Page from '../Page';
import './loginPageStyles.css';
import {
  createForm,
  createBtn,
  createInput,
  createDiv,
  createLink,
} from '../../utils/elementCreator';
import { EmailValidationErrors, PasswordValidationErrors } from './constants';

class LoginPage extends Page {
  private loginForm: HTMLElement;

  private preWelcomeDiv: HTMLDivElement;

  private welcomeDiv: HTMLDivElement;

  private emailInput: HTMLInputElement;

  private passwordInput: HTMLInputElement;

  private passwordPlusEyeDiv: HTMLDivElement;

  private eyeBtn: HTMLButtonElement;

  private signInBtn: HTMLButtonElement;

  private registerLink: HTMLAnchorElement;

  private emailErrors: EmailValidationErrors[] = [];

  private passwordErrors: PasswordValidationErrors[] = [];

  private isEmailValid: boolean = false;

  private isPasswordValid: boolean = false;

  private emailErrorsDiv: HTMLDivElement;

  private passwordErrorsDiv: HTMLDivElement;

  constructor(router: Router) {
    super(router);
    this.container = createDiv('container', document.body);
    this.loginForm = createForm('loginForm', this.container);
    this.preWelcomeDiv = createDiv('preWelcomeDiv', this.loginForm);
    this.preWelcomeDiv.innerHTML = '🐾';
    this.welcomeDiv = createDiv('welcomeDiv', this.loginForm);
    this.welcomeDiv.innerHTML = 'Login to Your Account';
    this.emailInput = createInput({
      className: 'emailInput',
      type: 'text',
      isActive: true,
      placeholder: 'Email',
      isRequired: true,
      parentElement: this.loginForm,
    });
    this.passwordPlusEyeDiv = createDiv('passwordPlusEyeDiv', this.loginForm);
    this.passwordInput = createInput({
      className: 'passwordInput',
      type: 'password',
      isActive: true,
      placeholder: 'Password',
      isRequired: true,
      parentElement: this.passwordPlusEyeDiv,
    });
    this.eyeBtn = createBtn('eyeBtn', '🙈', this.passwordPlusEyeDiv);
    this.eyeBtn.addEventListener('click', (event) => {
      event.preventDefault();

      if (this.passwordInput.type === 'password') {
        this.passwordInput.type = 'text';
        this.eyeBtn.textContent = '👀';
      } else {
        this.passwordInput.type = 'password';
        this.eyeBtn.textContent = '🙈';
      }
    });
    this.signInBtn = createBtn('button', 'SIGN IN', this.loginForm);
    this.signInBtn.disabled = true;

    this.registerLink = createLink(
      'registerLink',
      'Create Account',
      '/registration',
      this.loginForm
    );
    this.loginForm.appendChild(this.registerLink);
    this.emailErrorsDiv = createDiv('emailErrors');
    this.emailInput.after(this.emailErrorsDiv);
    this.passwordErrorsDiv = createDiv('passwordErrors');
    this.passwordPlusEyeDiv.after(this.passwordErrorsDiv);
    this.setupListeners();
  }

  private setupListeners(): void {
    this.emailInput.addEventListener('input', this.handleEmailInput.bind(this));
    this.passwordInput.addEventListener(
      'input',
      this.handlePasswordInput.bind(this)
    );
    // this.loginForm.addEventListener('submit', this.handleSubmit.bind(this));
  }

  private handleEmailInput(event: Event): void {
    const emailValue: string = (event.target as HTMLInputElement).value;
    this.emailErrors = [];
    this.validateEmail(emailValue);
  }

  private handlePasswordInput(event: Event): void {
    const passwordValue: string = (event.target as HTMLInputElement).value;
    this.passwordErrors = [];
    this.validatePassword(passwordValue);
  }

  private validateEmail(email: string): EmailValidationErrors[] | null {
    this.isEmailValid = false;
    this.signInBtn.disabled = true;
    this.emailErrorsDiv.innerHTML = '';
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.emailErrors.push(EmailValidationErrors.FORMAT_ERROR);
    }

    if (email.trim() !== email) {
      this.emailErrors.push(EmailValidationErrors.WHITESPACE_ERROR);
    }

    const atIndex: number = email.indexOf('@');
    const dotIndex: number = email.lastIndexOf('.');
    if (atIndex === -1 || dotIndex === -1 || dotIndex < atIndex) {
      this.emailErrors.push(EmailValidationErrors.DOMAIN_ERROR);
    }

    if (email.split('@').length !== 2) {
      this.emailErrors.push(EmailValidationErrors.AT_SYMBOL_ERROR);
    }

    if (this.emailErrors.length === 0) {
      this.isEmailValid = true;
    }
    if (this.isEmailValid && this.isPasswordValid) {
      this.signInBtn.disabled = false;
    }
    this.showEmailErrors(this.emailErrors);
    return this.emailErrors.length > 0 ? this.emailErrors : null;
  }

  // private handleSubmit(): void {}
  private validatePassword(
    password: string
  ): PasswordValidationErrors[] | null {
    this.isPasswordValid = false;
    this.signInBtn.disabled = true;
    this.passwordErrorsDiv.innerHTML = '';
    if (password.length < 8) {
      this.passwordErrors.push(PasswordValidationErrors.LENGTH_ERROR);
    }

    if (!/[A-Z]/.test(password)) {
      this.passwordErrors.push(PasswordValidationErrors.UPPERCASE_ERROR);
    }

    if (!/[a-z]/.test(password)) {
      this.passwordErrors.push(PasswordValidationErrors.LOWERCASE_ERROR);
    }

    if (!/\d/.test(password)) {
      this.passwordErrors.push(PasswordValidationErrors.DIGIT_ERROR);
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
      this.passwordErrors.push(PasswordValidationErrors.SPECIAL_CHAR_ERROR);
    }

    if (password.trim() !== password) {
      this.passwordErrors.push(PasswordValidationErrors.WHITESPACE_ERROR);
    }

    if (this.passwordErrors.length === 0) {
      this.isPasswordValid = true;
    }

    if (this.isEmailValid && this.isPasswordValid) {
      this.signInBtn.disabled = false;
    }
    this.showPasswordErrors(this.passwordErrors);
    return this.passwordErrors.length > 0 ? this.passwordErrors : null;
  }

  public showEmailErrors(emailErrors: EmailValidationErrors[]): void {
    if (emailErrors.length > 0) {
      this.emailErrorsDiv.innerHTML = `x Email must ${this.emailErrors.join(', ')}.`;
    }
  }

  public showPasswordErrors(passwordErrors: PasswordValidationErrors[]): void {
    if (passwordErrors.length > 0) {
      this.passwordErrorsDiv.innerHTML = `x Password must ${this.passwordErrors.join(', ')}.`;
    }
  }

  public render() {
    document.body.innerHTML = '';
    document.body.appendChild(this.container);
  }
}

export default LoginPage;
