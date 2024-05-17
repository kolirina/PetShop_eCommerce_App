import Router from '../../router';
import Page from '../Page';

class RegistrationPage extends Page {
  constructor(router: Router, parentElement: HTMLElement) {
    super(router, parentElement);
    this.container.textContent = 'Registration Page Content';
  }
}

export default RegistrationPage;
