import { UI_MESSAGES } from '../services/ui-messages.js';
import { validationService } from '../services/validation-service.js';
import { updateAccountPassword } from '../models/user-account.js';

function mapPasswordError(reason) {
  if (reason === 'too_short') {
    return UI_MESSAGES.errors.passwordTooShort;
  }
  if (reason === 'disallowed') {
    return UI_MESSAGES.errors.passwordDisallowed;
  }
  return UI_MESSAGES.errors.passwordComplexity;
}

export function createAccountController({
  view,
  storage,
  sessionState,
  passwordLogger,
  onPasswordChanged,
}) {
  function handleSubmit(event) {
    event.preventDefault();
    view.clearErrors();

    const values = view.getValues();
    const currentPassword = values.currentPassword || '';
    const newPassword = values.newPassword || '';
    const confirmPassword = values.confirmPassword || '';

    let hasMissing = false;
    if (!currentPassword) {
      const error = UI_MESSAGES.errors.required('current password');
      view.setFieldError('currentPassword', error.message, error.recovery);
      view.focusField('currentPassword');
      hasMissing = true;
    }

    if (!newPassword) {
      const error = UI_MESSAGES.errors.required('new password');
      view.setFieldError('newPassword', error.message, error.recovery);
      view.focusField('newPassword');
      hasMissing = true;
    }

    if (!confirmPassword) {
      const error = UI_MESSAGES.errors.required('confirmation');
      view.setFieldError('confirmPassword', error.message, error.recovery);
      view.focusField('confirmPassword');
      hasMissing = true;
    }

    if (hasMissing) {
      return;
    }

    const sessionUser = sessionState.getCurrentUser();
    if (!sessionUser || !sessionUser.email) {
      view.setStatus(UI_MESSAGES.errors.accessDenied.message, true);
      return;
    }

    let account;
    try {
      account = storage.findByEmail(sessionUser.email);
    } catch (error) {
      passwordLogger.logFailure({
        userId: sessionUser.id || null,
        error: 'lookup_failed',
      });
      view.setStatus(UI_MESSAGES.errors.passwordChangeUnavailable.message, true);
      return;
    }

    if (!account || account.password !== currentPassword) {
      view.setFieldError(
        'currentPassword',
        UI_MESSAGES.errors.currentPasswordIncorrect.message,
        UI_MESSAGES.errors.currentPasswordIncorrect.recovery,
      );
      view.focusField('currentPassword');
      return;
    }

    if (newPassword !== confirmPassword) {
      view.setFieldError(
        'confirmPassword',
        UI_MESSAGES.errors.passwordMismatch.message,
        UI_MESSAGES.errors.passwordMismatch.recovery,
      );
      view.focusField('confirmPassword');
      return;
    }

    try {
      validationService.getPasswordPolicy();
    } catch (error) {
      const unavailable = UI_MESSAGES.errors.passwordUnavailable;
      validationService.logPasswordFailure('unavailable', account.id);
      view.setFieldError('newPassword', unavailable.message, unavailable.recovery);
      view.focusField('newPassword');
      return;
    }

    const passwordResult = validationService.isPasswordValid(newPassword);
    if (!passwordResult.ok) {
      const error = mapPasswordError(passwordResult.reason);
      validationService.logPasswordFailure(passwordResult.reason, account.id);
      view.setFieldError('newPassword', error.message, error.recovery);
      view.focusField('newPassword');
      return;
    }

    let updatedAccount;
    try {
      updatedAccount = updateAccountPassword({ accountId: account.id, newPassword }, storage);
    } catch (error) {
      const message = (error && error.message) ? error.message : 'update_failed';
      passwordLogger.logFailure({
        userId: account.id,
        error: message,
      });
      view.setStatus(UI_MESSAGES.errors.passwordChangeUnavailable.message, true);
      return;
    }
    if (!updatedAccount) {
      passwordLogger.logFailure({
        userId: account.id,
        error: 'account_missing',
      });
      view.setStatus(UI_MESSAGES.errors.passwordChangeUnavailable.message, true);
      return;
    }

    const success = UI_MESSAGES.changePasswordSuccess;
    view.setStatus(`${success.title}. ${success.body}`, false);
    if (onPasswordChanged) {
      onPasswordChanged();
    }
  }

  return {
    init() {
      view.onSubmit(handleSubmit);
    },
    requireAuth() {
      if (!sessionState.isAuthenticated()) {
        view.setStatus(UI_MESSAGES.errors.accessDenied.message, true);
        return false;
      }
      return true;
    },
  };
}
