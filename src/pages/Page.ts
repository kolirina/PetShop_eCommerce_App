import Router from '../router';

export default class Page {
  protected container: HTMLElement;

  protected router: Router;

  constructor(router: Router) {
    this.container = document.createElement('div');
    this.router = router;
  }

  public render() {
    document.body.innerHTML = '';
    document.body.appendChild(this.container);
  }
}
