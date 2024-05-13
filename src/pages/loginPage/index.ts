import Router from '../../router';
import Page from '../Page';

class LoginPage extends Page {
  constructor(router: Router) {
    super(router);
    this.container.textContent = 'Login Page';
  }
}

export default LoginPage;
