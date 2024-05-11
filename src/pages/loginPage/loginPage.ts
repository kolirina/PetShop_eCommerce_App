class LoginPage {
  private element: HTMLElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.textContent = 'Login Page Content';
  }

  public render() {
    document.body.innerHTML = '';
    document.body.appendChild(this.element);
  }
}

export default LoginPage;
