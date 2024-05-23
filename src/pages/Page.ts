import Router from '../router';

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
    this.parentElement.innerHTML = '';
    this.parentElement.appendChild(this.container);
  }
}
