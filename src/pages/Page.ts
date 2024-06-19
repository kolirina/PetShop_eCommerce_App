import Router from '../router';
import checkAnonymousToken from '../utils/checkAnonymousToken';

export default class Page {
  protected parentElement: HTMLElement;

  public container: HTMLElement;

  protected router: Router;

  constructor(router: Router, parentElement: HTMLElement) {
    this.parentElement = parentElement;
    this.container = document.createElement('div');
    this.router = router;
  }

  public render() {
    checkAnonymousToken();
    this.parentElement.innerHTML = '';
    this.parentElement.appendChild(this.container);
  }
}
