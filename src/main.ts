import './pages/main.css';
import Router from './router';
import LoginPage from './pages/loginPage';
import MainPage from './pages/mainPage';
import NotFoundPage from './pages/notFoundPage';
import RegistrationPage from './pages/registrationPage';
import Pages from './router/pageNames';
import TemplatePage from './pages/templatePage';
import ProfilePage from './pages/profilePage';
import CatalogPage from './pages/catalogPage';
import ProductPage from './pages/productPage';
import BasketPage from './pages/basketPage';
import AboutPage from './pages/aboutPage';

const router = new Router();

const templatePage = new TemplatePage(router, document.body);
templatePage.render();

router.addRoutes({
  [Pages.MAIN]: () =>
    new MainPage(router, templatePage.getMainElement()).render(),
  [Pages.CATALOG]: () =>
    new CatalogPage(router, templatePage.getMainElement()).render(),
  [Pages.PRODUCT]: () =>
    new ProductPage(router, templatePage.getMainElement()).render(),
  [Pages.BASKET]: () =>
    new BasketPage(router, templatePage.getMainElement()).render(),
  [Pages.ABOUT_US]: () =>
    new AboutPage(router, templatePage.getMainElement()).render(),
  [Pages.LOGIN]: () => new LoginPage(router, templatePage).render(),
  [Pages.REGISTRATION]: () =>
    new RegistrationPage(router, templatePage).render(),
  [Pages.PROFILE]: () =>
    new ProfilePage(router, templatePage.getMainElement()).render(),
  [Pages.NOT_FOUND]: () =>
    new NotFoundPage(router, templatePage.getMainElement()).render(),
});
router.init();
