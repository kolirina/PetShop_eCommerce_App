import Router from '../../router';
import Page from '../Page';

class ProfilePage extends Page {
  constructor(router: Router, parentElement: HTMLElement) {
    super(router, parentElement);
    this.container.textContent = 'Profile';
  }
}
export default ProfilePage;
