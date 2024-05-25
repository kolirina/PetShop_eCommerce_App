import Pages from './pageNames';

interface Parameters {
  id: string;
}

export default class Router {
  public routes: { [key: string]: () => void } = {};

  addRoutes(routes: { [key: string]: () => void }) {
    this.routes = routes;
  }

  navigateTo(path: Pages, parameters?: Parameters) {
    const currentPath = window.location.pathname;
    if (parameters && currentPath !== `${path}/${parameters.id}`) {
      window.history.pushState({}, '', `${path}/${parameters.id}`);
      this.handleRoute();
    } else if (!parameters && path !== currentPath) {
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
      this.navigateTo(Pages.LOGIN);
      return;
    }

    // Access product by id
    if (path.match(/\/product\/\d+/)) {
      const match = path.match(/\d+/);
      if (match) {
        this.navigateTo(Pages.PRODUCT, { id: match[0] });
        this.routes[Pages.PRODUCT]();
        return;
      }
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
