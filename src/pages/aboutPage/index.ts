import Router from '../../router';
import Page from '../Page';

class AboutPage extends Page {
  constructor(router: Router, parentElement: HTMLElement) {
    super(router, parentElement);
    this.container.textContent = 'About Us';
  }
}

export default AboutPage;
