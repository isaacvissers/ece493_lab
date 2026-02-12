import { createLoginView } from './views/login-view.js';
import { createDashboardView } from './views/dashboard-view.js';
import { createLoginController } from './controllers/login-controller.js';
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
  render(loginView.element);
}

function showDashboard() {
  if (!loginController || !loginController.requireAuth()) {
    render(loginView.element);
    return;
  }
  const dashboardView = createDashboardView(sessionState.getCurrentUser());
  render(dashboardView);
}

function bootstrap() {
  showLogin();
}

bootstrap();

export { showLogin as __testShowLogin, showDashboard as __testShowDashboard };
