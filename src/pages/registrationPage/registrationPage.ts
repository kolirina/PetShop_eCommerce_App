class RegistrationPage {
  private element: HTMLElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.textContent = 'Registration Page Content';
  }

  public render() {
    document.body.innerHTML = '';
    document.body.appendChild(this.element);
  }
}

export default RegistrationPage;
