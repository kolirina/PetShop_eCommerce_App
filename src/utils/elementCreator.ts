type InputArguments = {
  className?: string;
  type: string;
  isActive?: boolean;
  placeholder?: string;
  isRequired?: boolean;
  parentElement?: HTMLElement;
};

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

export function createInput({
  className = '',
  type,
  isActive = true,
  placeholder,
  isRequired = false,
  parentElement,
}: InputArguments): HTMLInputElement {
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

export function createH3(
  className: string,
  text: string,
  parentElement?: HTMLElement
): HTMLHeadingElement {
  const element: HTMLHeadingElement = document.createElement('h3');
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

export function createLocalLink(
  className: string,
  text: string,
  href: string,
  navCallback: () => void,
  parentElement?: HTMLElement
): HTMLAnchorElement {
  const element: HTMLAnchorElement = document.createElement('a');
  element.classList.add(className);
  element.textContent = text;
  element.href = href;
  element.addEventListener('click', (e) => {
    e.preventDefault();
    navCallback();
  });
  appendToParent(element, parentElement);
  return element;
}

export function createParagraph(
  className: string,
  text: string,
  parentElement?: HTMLElement
): HTMLParagraphElement {
  const element: HTMLParagraphElement = document.createElement('p');
  element.classList.add(className);
  element.textContent = text;
  appendToParent(element, parentElement);
  return element;
}

export function createImg(
  className: string,
  src: string,
  alt: string,
  parentElement: HTMLElement
): HTMLImageElement {
  const element = document.createElement('img');
  element.classList.add(className);
  element.src = src;
  element.alt = alt;
  appendToParent(element, parentElement);
  return element;
}
