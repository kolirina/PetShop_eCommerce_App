import Router from '../../router';
import Pages from '../../router/pageNames';
import { createBtn } from '../../utils/elementCreator';
import Page from '../Page';

class MainPage extends Page {
  constructor(router: Router) {
    super(router);
    this.container.textContent = 'Main Page Content';
    const btn1 = createBtn('button', 'Go to Login', this.container);
    btn1.addEventListener('click', () => router.navigateTo(Pages.LOGIN));
    const btn2 = createBtn('button', 'Go to Registration', this.container);
    btn2.addEventListener('click', () => router.navigateTo(Pages.REGISTRATION));
  }
}

export default MainPage;
