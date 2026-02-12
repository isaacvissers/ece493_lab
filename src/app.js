import { createLoginView } from './views/login-view.js';
import { createDashboardView } from './views/dashboard-view.js';
import { createLoginController } from './controllers/login-controller.js';
import { createRegistrationView } from './views/registration-view.js';
import { createRegistrationController } from './controllers/registration-controller.js';
import { createAccountSettingsView } from './views/account-settings-view.js';
import { createAccountController } from './controllers/account-controller.js';
import { storageService } from './services/storage-service.js';
import { sessionState } from './models/session-state.js';
import { loginLogging } from './services/login-logging.js';
import { passwordErrorLogging } from './services/password-error-logging.js';
import { UI_MESSAGES } from './services/ui-messages.js';

const appRoot = document.getElementById('app');
let loginController = null;
let loginView = null;

function render(view) {
  appRoot.innerHTML = '';
  appRoot.appendChild(view);
}

function showLogin(accessDeniedMessage = null) {
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
  if (accessDeniedMessage) {
    loginView.showAccessDenied(accessDeniedMessage);
  }
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

function showAccountSettings() {
  if (!sessionState.isAuthenticated()) {
    showLogin(UI_MESSAGES.errors.accessDenied.message);
    return;
  }
  const accountView = createAccountSettingsView();
  const accountController = createAccountController({
    view: accountView,
    storage: storageService,
    sessionState,
    passwordLogger: passwordErrorLogging,
    onPasswordChanged: showDashboard,
  });
  accountController.init();
  accountView.onBack(showDashboard);
  render(accountView.element);
}

function showDashboard() {
  if (!sessionState.isAuthenticated()) {
    showLogin(UI_MESSAGES.errors.accessDenied.message);
    return;
  }
  const dashboardView = createDashboardView(sessionState.getCurrentUser());
  dashboardView.onChangePassword(showAccountSettings);
  render(dashboardView.element);
}

function bootstrap() {
  showLogin();
}

bootstrap();

export {
  showLogin as __testShowLogin,
  showDashboard as __testShowDashboard,
  showRegistration as __testShowRegistration,
  showAccountSettings as __testShowAccountSettings,
};
