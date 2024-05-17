import Router from '../../router';
import Page from '../Page';

class MainPage extends Page {
  constructor(router: Router, parentElement: HTMLElement) {
    super(router, parentElement);
    this.container.textContent = 'Main Page Content';
  }
}

export default MainPage;
