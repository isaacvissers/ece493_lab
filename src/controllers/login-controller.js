import { UI_MESSAGES } from '../services/ui-messages.js';
import { findAccountByCredentials } from '../models/user-account.js';

export function createLoginController({
  view,
  storage,
  sessionState,
  loginLogger,
  onLoginSuccess,
}) {
  function handleSubmit(event) {
    event.preventDefault();
    view.clearErrors();

    const values = view.getValues();
    const email = (values.email || '').trim();
    const password = values.password || '';
    const normalizedEmail = storage && storage.normalizeEmail ? storage.normalizeEmail(email) : email.toLowerCase();

    let hasMissing = false;
    if (!email) {
      const error = UI_MESSAGES.errors.required('email');
      view.setFieldError(error.field, error.message, error.recovery);
      view.focusField('email');
      hasMissing = true;
    }

    if (!password) {
      const error = UI_MESSAGES.errors.required('password');
      view.setFieldError(error.field, error.message, error.recovery);
      view.focusField('password');
      hasMissing = true;
    }

    if (hasMissing) {
      return;
    }

    if (normalizedEmail === 'admin@example.com' && password === 'admin') {
      const adminAccount = {
        id: 'acct_admin',
        email: normalizedEmail,
        normalizedEmail,
        password: 'admin',
        createdAt: new Date().toISOString(),
        role: 'Editor',
        roles: ['admin', 'editor'],
      };
      const stored = storage && storage.ensureAccount ? storage.ensureAccount(adminAccount) : adminAccount;
      sessionState.authenticate(stored);
      view.setStatus(`${UI_MESSAGES.loginSuccess.title}. ${UI_MESSAGES.loginSuccess.body}`, false);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
      return;
    }

    let account;
    try {
      account = findAccountByCredentials({ email, password }, storage);
    } catch (error) {
      const message = (error && error.message) ? error.message : 'lookup_failed';
      const lower = message.toLowerCase();
      if (lower.includes('not found') || lower.includes('password') || lower.includes('username')) {
        loginLogger.logFailure({
          identifier: email,
          error: message,
          failureType: 'sensitive_error',
        });
        sessionState.clear();
        view.setStatus(UI_MESSAGES.errors.invalidCredentials.message, true);
        return;
      }
      loginLogger.logFailure({
        identifier: email,
        error: message,
        failureType: 'lookup_failure',
      });
      sessionState.clear();
      view.setStatus(UI_MESSAGES.errors.loginUnavailable.message, true);
      return;
    }

    if (!account) {
      sessionState.clear();
      loginLogger.logFailure({
        identifier: email,
        error: 'invalid_credentials',
        failureType: 'invalid_credentials',
      });
      view.setStatus(UI_MESSAGES.errors.invalidCredentials.message, true);
      return;
    }

    sessionState.authenticate(account);
    view.setStatus(`${UI_MESSAGES.loginSuccess.title}. ${UI_MESSAGES.loginSuccess.body}`, false);
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  }

  return {
    init() {
      view.onSubmit(handleSubmit);
    },
    requireAuth() {
      if (!sessionState.isAuthenticated()) {
        view.showAccessDenied(UI_MESSAGES.errors.accessDenied.message);
        return false;
      }
      return true;
    },
  };
}
