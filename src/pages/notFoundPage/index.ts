import Router from '../../router';
import Page from '../Page';

class NotFoundPage extends Page {
  constructor(router: Router) {
    super(router);
    this.container.textContent = 'Error 404';
  }
}

export default NotFoundPage;
