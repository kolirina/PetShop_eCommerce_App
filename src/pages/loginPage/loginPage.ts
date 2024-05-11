import {
  createForm,
  createBtn,
  createInput,
  createDiv,
  createLink,
} from '../../utils/elementCreator';

enum EmailValidationErrors {
  FORMAT_ERROR = 'Email address must be properly formatted (e.g., user@example.com).',
  WHITESPACE_ERROR = 'Email address must not contain leading or trailing whitespace.',
  DOMAIN_ERROR = 'Email address must contain a domain name (e.g., example.com).',
  AT_SYMBOL_ERROR = "Email address must contain an '@' symbol separating local part and domain name.",
}

enum PasswordValidationErrors {
  LENGTH_ERROR = 'Password must be at least 8 characters long.',
  UPPERCASE_ERROR = 'Password must contain at least one uppercase letter (A-Z).',
  LOWERCASE_ERROR = 'Password must contain at least one lowercase letter (a-z).',
  DIGIT_ERROR = 'Password must contain at least one digit (0-9).',
  SPECIAL_CHAR_ERROR = 'Password must contain at least one special character.',
  WHITESPACE_ERROR = 'Password must not contain leading or trailing whitespace.',
}

class LoginPage {
  private loginForm: HTMLElement;

  private welcomeDiv: HTMLDivElement;

  private emailInput: HTMLInputElement;

  private passwordInput: HTMLInputElement;

  private passwordPlusEyeDiv: HTMLDivElement;

  private eyeBtn: HTMLButtonElement;

  private signInBtn: HTMLButtonElement;

  private registerLink: HTMLAnchorElement;

  private emailErrors: EmailValidationErrors[] = [];

  private passwordErrors: PasswordValidationErrors[] = [];

  constructor() {
    this.loginForm = createForm('loginForm', document.body);
    this.welcomeDiv = createDiv('welcomeDiv', this.loginForm);
    this.welcomeDiv.innerHTML = 'Login to Your Account';
    this.emailInput = createInput({
      className: 'input',
      type: 'email',
      isActive: true,
      placeholder: 'Email',
      isRequired: true,
      parentElement: this.loginForm,
    });
    this.passwordPlusEyeDiv = createDiv('passwordPlusEyeDiv', this.loginForm);
    this.passwordInput = createInput({
      className: 'input',
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
    this.loginForm.appendChild(this.signInBtn);

    this.registerLink = createLink(
      'registerLink',
      'Create Account',
      'https://example.com',
      this.loginForm
    );
    this.loginForm.appendChild(this.registerLink);
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
    this.validateEmail(emailValue);
  }

  private handlePasswordInput(event: Event): void {
    const passwordValue: string = (event.target as HTMLInputElement).value;
    this.validatePassword(passwordValue);
  }

  // private handleSubmit(): void {}

  private validateEmail(email: string): EmailValidationErrors[] | null {
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

    return this.emailErrors.length > 0 ? this.emailErrors : null;
  }

  private validatePassword(
    password: string
  ): PasswordValidationErrors[] | null {
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

    return this.passwordErrors.length > 0 ? this.passwordErrors : null;
  }
}

export default LoginPage;
