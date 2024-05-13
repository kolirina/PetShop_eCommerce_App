import Router from './router';
import LoginPage from './pages/loginPage';
import MainPage from './pages/mainPage';
import NotFoundPage from './pages/notFoundPage';
import RegistrationPage from './pages/registrationPage';
import Pages from './router/pageNames';

const router = new Router();
router.addRoutes({
  [Pages.MAIN]: () => new MainPage(router).render(),
  [Pages.LOGIN]: () => new LoginPage(router).render(),
  [Pages.REGISTRATION]: () => new RegistrationPage(router).render(),
  [Pages.NOT_FOUND]: () => new NotFoundPage(router).render(),
});
router.init();
