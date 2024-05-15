export default class Footer {
  private container: HTMLElement;

  constructor() {
    this.container = document.createElement('footer');
    this.container.textContent = 'Footer Content';
  }

  getFooterElement() {
    return this.container;
  }
}
