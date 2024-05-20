import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import LoginPage from '.';
import Router from '../../router';
import TemplatePage from '../templatePage';
import { EmailValidationErrors, PasswordValidationErrors } from './constants';

function createEventWithTarget(target: HTMLElement): Event {
  const event = new Event('input', {
    bubbles: true,
    cancelable: true,
  });
  Object.defineProperty(event, 'target', { value: target, enumerable: true });
  return event;
}

describe('LoginPage', () => {
  let loginPage: LoginPage;
  let dom: JSDOM;
  let container: HTMLElement;
  let router: Router;
  let templatePage: TemplatePage;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
      url: 'http://localhost',
    });

    global.document = dom.window.document;
    global.window = dom.window as unknown as Window & typeof globalThis;

    router = { navigateTo: vi.fn() } as unknown as Router;
    templatePage = {
      getMainElement: vi.fn(() => document.createElement('div')),
      getHeader: vi.fn(() => ({ updateHeader: vi.fn() })),
    } as unknown as TemplatePage;

    loginPage = new LoginPage(router, templatePage);
    container = document.body.appendChild(document.createElement('div'));
    container.appendChild(loginPage.loginForm);
  });

  it('should create login form correctly', () => {
    expect(container.querySelector('.preWelcomeDiv')).not.toBeNull();
    expect(container.querySelector('.welcomeDiv')).not.toBeNull();
    expect(container.querySelector('.emailInput')).not.toBeNull();
    expect(container.querySelector('.passwordInput')).not.toBeNull();
    expect(container.querySelector('.eyeBtn')).not.toBeNull();
    expect(container.querySelector('.registerLink')).not.toBeNull();
    expect(container.querySelector('.emailErrors')).not.toBeNull();
    expect(container.querySelector('.passwordErrors')).not.toBeNull();
  });

  it('should validate email correctly', () => {
    const validEmail = 'test@example.com';
    const invalidEmail = 'invalid-email';

    loginPage.emailInput.value = validEmail;
    loginPage.handleEmailInput(createEventWithTarget(loginPage.emailInput));
    expect(loginPage.emailErrors).toEqual([]);
    expect(loginPage.isEmailValid).toBe(true);

    loginPage.emailInput.value = invalidEmail;
    loginPage.handleEmailInput(createEventWithTarget(loginPage.emailInput));
    expect(loginPage.emailErrors).toContain(EmailValidationErrors.FORMAT_ERROR);
    expect(loginPage.isEmailValid).toBe(false);
  });

  it('should validate password correctly', () => {
    const validPassword = 'Valid123!';
    const invalidPassword = 'short';

    loginPage.passwordInput.value = validPassword;
    loginPage.handlePasswordInput(
      createEventWithTarget(loginPage.passwordInput)
    );
    expect(loginPage.passwordErrors).toEqual([]);
    expect(loginPage.isPasswordValid).toBe(true);

    loginPage.passwordInput.value = invalidPassword;
    loginPage.handlePasswordInput(
      createEventWithTarget(loginPage.passwordInput)
    );
    expect(loginPage.passwordErrors).toContain(
      PasswordValidationErrors.LENGTH_ERROR
    );
    expect(loginPage.isPasswordValid).toBe(false);
  });

  it('should toggle password visibility when eye button is clicked', () => {
    expect(loginPage.passwordInput.type).toBe('password');
    expect(loginPage.eyeBtn.textContent).toBe('🙈');

    loginPage.eyeBtn.click();

    expect(loginPage.passwordInput.type).toBe('text');
    expect(loginPage.eyeBtn.textContent).toBe('👀');

    loginPage.eyeBtn.click();

    expect(loginPage.passwordInput.type).toBe('password');
    expect(loginPage.eyeBtn.textContent).toBe('🙈');
  });
});
