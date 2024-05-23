import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import Footer from './index';
import styles from './footer.module.css';

describe('Footer', () => {
  let dom: JSDOM;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
      url: 'http://localhost',
    });
    global.document = dom.window.document;
    global.window = dom.window as unknown as Window & typeof globalThis;
  });

  it('should render the Footer with correct elements and styles', () => {
    const footer = new Footer();
    document.body.appendChild(footer.getFooterElement());

    const footerElement = document.querySelector('footer');
    expect(footerElement).not.toBeNull();
    expect(footerElement!.classList.contains(styles.footer)).toBe(true);

    const infoSpan = footerElement!.querySelector(`.${styles.info}`);
    expect(infoSpan).not.toBeNull();
    expect(infoSpan!.textContent).toBe('Ⓒ2024 Pet Shop');
  });

  it('should return the footer element', () => {
    const footer = new Footer();
    const footerElement = footer.getFooterElement();
    expect(footerElement.tagName.toLowerCase()).toBe('footer');
  });
});
