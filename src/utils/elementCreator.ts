function appendToParent(
  element: HTMLElement,
  parentElement?: HTMLElement
): void {
  if (parentElement) {
    parentElement.appendChild(element);
  }
}

export function createDiv(
  className: string,
  parentElement?: HTMLElement
): HTMLDivElement {
  const element: HTMLDivElement = document.createElement('div');
  element.classList.add(className);
  appendToParent(element, parentElement);
  return element;
}

export function createForm(
  className: string,
  parentElement?: HTMLElement
): HTMLFormElement {
  const element: HTMLFormElement = document.createElement('form');
  element.classList.add(className);
  appendToParent(element, parentElement);
  return element;
}

export function createInput(
  className: string,
  type: string,
  isActive = true,
  placeholder?: string,
  isRequired = false,
  parentElement?: HTMLElement
): HTMLInputElement {
  const element: HTMLInputElement = document.createElement('input');
  element.type = type;
  element.classList.add(className);
  element.disabled = !isActive;
  element.required = isRequired;
  if (placeholder) {
    element.placeholder = placeholder;
  }
  appendToParent(element, parentElement);
  return element;
}

export function createLabel(
  className: string,
  text = '',
  parentElement?: HTMLElement
): HTMLLabelElement {
  const element: HTMLLabelElement = document.createElement('label');
  element.textContent = text;
  element.classList.add(className);
  appendToParent(element, parentElement);
  return element;
}

export function createH1(
  className: string,
  text: string,
  parentElement?: HTMLElement
): HTMLHeadingElement {
  const element: HTMLHeadingElement = document.createElement('h1');
  element.classList.add(className);
  element.textContent = text;
  appendToParent(element, parentElement);
  return element;
}

export function createBtn(
  className: string,
  text: string,
  parentElement?: HTMLElement
): HTMLButtonElement {
  const element: HTMLButtonElement = document.createElement('button');
  element.classList.add(className);
  element.textContent = text;
  appendToParent(element, parentElement);
  return element;
}

export function createSpan(
  className: string,
  text: string,
  parentElement?: HTMLElement
): HTMLSpanElement {
  const element: HTMLSpanElement = document.createElement('span');
  element.classList.add(className);
  element.textContent = text;
  appendToParent(element, parentElement);
  return element;
}

export function createLink(
  className: string,
  text: string,
  href: string,
  parentElement?: HTMLElement
): HTMLAnchorElement {
  const element: HTMLAnchorElement = document.createElement('a');
  element.classList.add(className);
  element.href = href;
  element.textContent = text;
  appendToParent(element, parentElement);
  return element;
}
