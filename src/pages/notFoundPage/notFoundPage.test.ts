import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import Router from '../../router';
import Pages from '../../router/pageNames';
import NotFoundPage from './index';
import styles from './notFoundPage.module.css';

describe('NotFoundPage', () => {
  let dom: JSDOM;
  let router: Router;
  let container: HTMLElement;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
      url: 'http://localhost',
    });
    global.document = dom.window.document;
    global.window = dom.window as unknown as Window & typeof globalThis;

    router = new Router();
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('should render the NotFoundPage with correct elements', () => {
    const notFoundPage = new NotFoundPage(router, container);

    expect(notFoundPage.container.classList.contains(styles.container)).toBe(
      true
    );

    const info = notFoundPage.container.querySelector(`.${styles.info}`);
    expect(info).not.toBeNull();

    const errorParagraph = info!.querySelector(`.${styles.error}`);
    expect(errorParagraph).not.toBeNull();
    expect(errorParagraph!.textContent).toBe('404');

    const h1 = info!.querySelector(`.${styles.h1}`);
    expect(h1).not.toBeNull();
    expect(h1!.textContent).toBe('Oops!');

    const description = info!.querySelector(`.${styles.description}`);
    expect(description).not.toBeNull();
    expect(description!.textContent).toContain(
      'We are very sorry for the inconvenience.'
    );

    const homeLink = info!.querySelector(`.${styles.home}`);
    expect(homeLink).not.toBeNull();
    expect(homeLink!.textContent).toBe('Go Home');

    const errorImage = notFoundPage.container.querySelector(
      `.${styles.errorImage}`
    );
    expect(errorImage).not.toBeNull();
    expect((errorImage as HTMLImageElement).src).toContain('notfound.png');
  });

  it('should navigate to the main page when the "Go Home" link is clicked', () => {
    const navigateToSpy = vi.spyOn(router, 'navigateTo');
    const notFoundPage = new NotFoundPage(router, container);

    const homeLink = notFoundPage.container.querySelector(
      `.${styles.home}`
    ) as HTMLElement;
    homeLink.click();

    expect(navigateToSpy).toHaveBeenCalledWith(Pages.MAIN);
  });
});
