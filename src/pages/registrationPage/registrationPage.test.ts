import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import Router from '../../router';
import TemplatePage from '../templatePage';
import RegistrationPage from '.';

describe('RegistrationPage', () => {
  let registrationPage: RegistrationPage;
  let dom: JSDOM;
  let templatePage: TemplatePage;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
      url: 'http://localhost',
    });

    global.document = dom.window.document;
    global.window = dom.window as unknown as Window & typeof globalThis;

    const router = new Router();
    templatePage = {
      getMainElement: vi.fn(() => document.createElement('div')),
      getHeader: vi.fn(() => ({ updateHeader: vi.fn() })),
    } as unknown as TemplatePage;
    registrationPage = new RegistrationPage(router, templatePage);
  });

  it('should validate email correctly', () => {
    registrationPage.emailInput.value = 'test@example.com';
    registrationPage.validateEmail(registrationPage.emailInput.value);
    expect(registrationPage.areAllInputsValid.email).toBeTruthy();

    registrationPage.emailInput.value = 'invalid-email';
    registrationPage.validateEmail(registrationPage.emailInput.value);
    expect(registrationPage.areAllInputsValid.email).toBeFalsy();
  });

  it('should validate password correctly', () => {
    registrationPage.passwordInput.value = 'Valid123!';
    registrationPage.validatePassword(registrationPage.passwordInput.value);
    expect(registrationPage.areAllInputsValid.password).toBeTruthy();

    registrationPage.passwordInput.value = 'short';
    registrationPage.validatePassword(registrationPage.passwordInput.value);
    expect(registrationPage.areAllInputsValid.password).toBeFalsy();
  });

  it('should validate repeat email correctly', () => {
    registrationPage.emailInput.value = 'test@example.com';
    registrationPage.confirmEmailInput.value = 'test@example.com';
    registrationPage.validateRepeatEmail(
      registrationPage.confirmEmailInput.value
    );
    expect(registrationPage.areAllInputsValid.remail).toBeTruthy();

    registrationPage.confirmEmailInput.value = 'different@example.com';
    registrationPage.validateRepeatEmail(
      registrationPage.confirmEmailInput.value
    );
    expect(registrationPage.areAllInputsValid.remail).toBeFalsy();
  });

  it('should validate repeat password correctly', () => {
    registrationPage.passwordInput.value = 'Valid123!';
    registrationPage.repeatPasswordInput.value = 'Valid123!';
    registrationPage.validateRepeatPassword(
      registrationPage.repeatPasswordInput.value
    );
    expect(registrationPage.areAllInputsValid.rpassword).toBeTruthy();

    registrationPage.repeatPasswordInput.value = 'differentpassword';
    registrationPage.validateRepeatPassword(
      registrationPage.repeatPasswordInput.value
    );
    expect(registrationPage.areAllInputsValid.rpassword).toBeFalsy();
  });
});
