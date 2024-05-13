import Router from '../../router';
import Page from '../Page';

class RegistrationPage extends Page {
  constructor(router: Router) {
    super(router);
    this.container.textContent = 'Registration Page Content';
  }
}

export default RegistrationPage;
