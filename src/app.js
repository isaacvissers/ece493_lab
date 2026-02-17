import { createLoginView } from './views/login-view.js';
import { createDashboardView } from './views/dashboard-view.js';
import { createLoginController } from './controllers/login-controller.js';
import { createRegistrationView } from './views/registration-view.js';
import { createRegistrationController } from './controllers/registration-controller.js';
import { createAccountSettingsView } from './views/account-settings-view.js';
import { createAccountController } from './controllers/account-controller.js';
import { createSubmitManuscriptView } from './views/submit-manuscript-view.js';
import { createManuscriptSubmissionController } from './controllers/manuscript-submission-controller.js';
import { storageService } from './services/storage-service.js';
import { sessionState } from './models/session-state.js';
import { loginLogging } from './services/login-logging.js';
import { passwordErrorLogging } from './services/password-error-logging.js';
import { submissionStorage } from './services/submission-storage.js';
import { submissionErrorLog } from './services/submission-error-log.js';
import { draftStorage } from './services/draft-storage.js';
import { draftErrorLog } from './services/draft-error-log.js';
import { UI_MESSAGES } from './services/ui-messages.js';

const appRoot = document.getElementById('app');
let loginController = null;
let loginView = null;
let pendingRoute = null;

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
    onLoginSuccess: () => {
      const nextRoute = pendingRoute;
      pendingRoute = null;
      if (['submit', 'upload', 'metadata', 'submission-validation'].includes(nextRoute)) {
        showSubmitManuscript();
        return;
      }
      showDashboard();
    },
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
    pendingRoute = 'account-settings';
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

function showSubmitManuscript() {
  if (!sessionState.isAuthenticated()) {
    pendingRoute = 'submit';
    showLogin(UI_MESSAGES.errors.accessDenied.message);
    return;
  }
  const submitView = createSubmitManuscriptView();
  const submitController = createManuscriptSubmissionController({
    view: submitView,
    storage: submissionStorage,
    draftStorage,
    sessionState,
    errorLogger: submissionErrorLog,
    draftErrorLogger: draftErrorLog,
    onSubmitSuccess: showDashboard,
    onAuthRequired: () => {
      pendingRoute = 'submit';
      showLogin(UI_MESSAGES.errors.accessDenied.message);
    },
  });
  submitController.init();
  submitView.onBack(showDashboard);
  render(submitView.element);
}

function showUploadManuscript() {
  showSubmitManuscript();
}

function showMetadata() {
  showSubmitManuscript();
}

function showSubmissionValidation() {
  showSubmitManuscript();
}

function showDashboard() {
  if (!sessionState.isAuthenticated()) {
    showLogin(UI_MESSAGES.errors.accessDenied.message);
    return;
  }
  const currentUser = sessionState.getCurrentUser();
  const userEmail = currentUser && currentUser.email ? currentUser.email : null;
  const manuscripts = submissionStorage.getManuscripts()
    .filter((manuscript) => (
      userEmail
        ? manuscript.submittedBy === userEmail || manuscript.contactEmail === userEmail
        : false
    ));
  const dashboardView = createDashboardView(currentUser, manuscripts);
  dashboardView.onChangePassword(showAccountSettings);
  dashboardView.onSubmitPaper(showSubmitManuscript);
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
  showSubmitManuscript as __testShowSubmitManuscript,
  showUploadManuscript as __testShowUploadManuscript,
  showMetadata as __testShowMetadata,
  showSubmissionValidation as __testShowSubmissionValidation,
};
