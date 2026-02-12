import { createLoginView } from './views/login-view.js';
import { createDashboardView } from './views/dashboard-view.js';
import { createLoginController } from './controllers/login-controller.js';
import { createRegistrationView } from './views/registration-view.js';
import { createRegistrationController } from './controllers/registration-controller.js';
import { storageService } from './services/storage-service.js';
import { sessionState } from './models/session-state.js';
import { loginLogging } from './services/login-logging.js';

const appRoot = document.getElementById('app');
let loginController = null;
let loginView = null;

function render(view) {
  appRoot.innerHTML = '';
  appRoot.appendChild(view);
}

function showLogin() {
  loginView = createLoginView();
  loginController = createLoginController({
    view: loginView,
    storage: storageService,
    sessionState,
    loginLogger: loginLogging,
    onLoginSuccess: showDashboard,
  });
  loginController.init();
  loginView.onRegister(showRegistration);
  render(loginView.element);
}

function showRegistration() {
  const registrationView = createRegistrationView();
  const registrationController = createRegistrationController({
    view: registrationView,
    storage: storageService,
    sessionState,
    onRegistrationSuccess: showDashboard,
  });
  registrationController.init();
  registrationView.onLogin(showLogin);
  render(registrationView.element);
}

function showDashboard() {
  if (!sessionState.isAuthenticated()) {
    showLogin();
    return;
  }
  const dashboardView = createDashboardView(sessionState.getCurrentUser());
  render(dashboardView);
}

function bootstrap() {
  showLogin();
}

bootstrap();

export {
  showLogin as __testShowLogin,
  showDashboard as __testShowDashboard,
  showRegistration as __testShowRegistration,
};
