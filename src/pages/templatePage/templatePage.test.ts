import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import TemplatePage from './index';
import Router from '../../router';
import Header from '../../components/header';
import styles from './templatePage.module.css';

describe('TemplatePage', () => {
  let dom: JSDOM;
  let router: Router;
  let container: HTMLElement;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
      url: 'http://localhost',
    });
    global.document = dom.window.document;
    global.window = dom.window as unknown as Window & typeof globalThis;
    global.localStorage = dom.window.localStorage;

    router = new Router();
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('should render the TemplatePage with header, main, and footer', () => {
    const templatePage = new TemplatePage(router, container);

    expect(templatePage.container.classList.contains(styles.page)).toBe(true);

    const headerElement = templatePage.container.querySelector('header');
    expect(headerElement).not.toBeNull();

    const mainElement = templatePage.container.querySelector('main');
    expect(mainElement).not.toBeNull();

    const footerElement = templatePage.container.querySelector('footer');
    expect(footerElement).not.toBeNull();
  });

  it('should return the header instance', () => {
    const templatePage = new TemplatePage(router, container);
    const header = templatePage.getHeader();

    expect(header).toBeInstanceOf(Header);
  });

  it('should return the main element', () => {
    const templatePage = new TemplatePage(router, container);
    const mainElement = templatePage.getMainElement();

    expect(mainElement.tagName.toLowerCase()).toBe('main');
  });
});
