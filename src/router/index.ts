import Pages from './pageNames';

export default class Router {
  private routes: { [key: string]: () => void } = {};

  addRoutes(routes: { [key: string]: () => void }) {
    this.routes = routes;
  }

  navigateTo(path: Pages) {
    window.history.pushState({}, '', path);
    this.handleRoute();
  }

  handleRoute() {
    const path = window.location.pathname;
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
