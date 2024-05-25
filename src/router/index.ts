import Pages from './pageNames';

export default class Router {
  public routes: { [key: string]: () => void } = {};

  addRoutes(routes: { [key: string]: () => void }) {
    this.routes = routes;
  }

  navigateTo(path: Pages) {
    const currentPath = window.location.pathname;
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      this.handleRoute();
    }
  }

  handleRoute() {
    const path = window.location.pathname;
    // Prevent logged in user to access Login and Registration pages
    if (
      (path === Pages.LOGIN || path === Pages.REGISTRATION) &&
      localStorage.getItem('token') &&
      localStorage.getItem('id')
    ) {
      this.navigateTo(Pages.MAIN);
      return;
    }

    // Prevent not logged in user to access Profile page
    if (
      path === Pages.PROFILE &&
      !localStorage.getItem('token') &&
      !localStorage.getItem('id')
    ) {
      this.navigateTo(Pages.MAIN);
      return;
    }

    if (path in this.routes) {
      this.routes[path]();
    } else {
      this.routes[Pages.NOT_FOUND]();
    }
  }

  init() {
    window.addEventListener('popstate', () => {
      this.handleRoute();
    });
    this.handleRoute();
  }
}
