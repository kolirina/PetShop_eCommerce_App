import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import Router from './index';
import Pages from './pageNames';

describe('Router', () => {
  let dom: JSDOM;
  let router: Router;
  let routes: { [key: string]: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
      url: 'http://localhost',
    });
    global.document = dom.window.document;
    global.window = dom.window as unknown as Window & typeof globalThis;
    global.localStorage = dom.window.localStorage;

    router = new Router();
    routes = {
      [Pages.MAIN]: vi.fn(),
      [Pages.LOGIN]: vi.fn(),
      [Pages.REGISTRATION]: vi.fn(),
      [Pages.NOT_FOUND]: vi.fn(),
    };
    router.addRoutes(routes);
  });

  it('should add routes', () => {
    expect(router.routes).toEqual(routes);
  });

  it('should navigate to a different path and handle the route', () => {
    const spyHandleRoute = vi.spyOn(router, 'handleRoute');
    router.navigateTo(Pages.LOGIN);

    expect(window.location.pathname).toBe(Pages.LOGIN);
    expect(spyHandleRoute).toHaveBeenCalled();
  });

  it('should not navigate if the path is the same', () => {
    window.history.pushState({}, '', Pages.MAIN);
    const spyHandleRoute = vi.spyOn(router, 'handleRoute');

    router.navigateTo(Pages.MAIN);

    expect(window.location.pathname).toBe(Pages.MAIN);
    expect(spyHandleRoute).not.toHaveBeenCalled();
  });

  it('should handle login or registration route and redirect to main if authenticated', () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('id', 'dummy-id');

    const spyNavigateTo = vi.spyOn(router, 'navigateTo');

    window.history.pushState({}, '', Pages.LOGIN);
    router.handleRoute();

    expect(spyNavigateTo).toHaveBeenCalledWith(Pages.MAIN);

    window.history.pushState({}, '', Pages.REGISTRATION);
    router.handleRoute();

    expect(spyNavigateTo).toHaveBeenCalledWith(Pages.MAIN);
  });

  it('should call the appropriate route function if the path exists', () => {
    window.history.pushState({}, '', Pages.MAIN);
    router.handleRoute();

    expect(routes[Pages.MAIN]).toHaveBeenCalled();

    window.history.pushState({}, '', Pages.LOGIN);
    router.handleRoute();

    expect(routes[Pages.LOGIN]).toHaveBeenCalled();
  });

  it('should call the not found route function if the path does not exist', () => {
    window.history.pushState({}, '', '/non-existent');
    router.handleRoute();

    expect(routes[Pages.NOT_FOUND]).toHaveBeenCalled();
  });

  it('should handle popstate events', () => {
    const spyHandleRoute = vi.spyOn(router, 'handleRoute');

    router.init();
    const popstateEvent = new window.Event('popstate');
    window.dispatchEvent(popstateEvent);

    expect(spyHandleRoute).toHaveBeenCalled();
  });

  it('should initialize and handle the current route', () => {
    const spyHandleRoute = vi.spyOn(router, 'handleRoute');

    router.init();

    expect(spyHandleRoute).toHaveBeenCalled();
  });
});
