import { createUserAccount } from '../models/user-account.js';
import { UI_MESSAGES } from '../services/ui-messages.js';
import { validationService } from '../services/validation-service.js';

function mapPasswordError(reason) {
  if (reason === 'too_short') {
    return UI_MESSAGES.errors.passwordTooShort;
  }
  if (reason === 'complexity') {
    return UI_MESSAGES.errors.passwordComplexity;
  }
  if (reason === 'disallowed') {
    return UI_MESSAGES.errors.passwordDisallowed;
  }
  return UI_MESSAGES.errors.passwordComplexity;
}

export function createRegistrationController({
  view,
  storage,
  sessionState,
  onRegistrationSuccess,
}) {
  function handleSubmit(event) {
    event.preventDefault();
    view.clearErrors();

    const values = view.getValues();
    const email = validationService.normalizeEmail(values.email);
    const password = values.password || '';

    if (!email) {
      const error = UI_MESSAGES.errors.required('email');
      storage.logValidationFailure({ type: 'required', field: 'email' });
      view.setFieldError(error.field, error.message, error.recovery);
      view.focusField('email');
      return;
    }

    if (!password) {
      const error = UI_MESSAGES.errors.required('password');
      storage.logValidationFailure({ type: 'required', field: 'password' });
      view.setFieldError(error.field, error.message, error.recovery);
      view.focusField('password');
      return;
    }

    if (!validationService.isEmailValid(email)) {
      const error = UI_MESSAGES.errors.emailFormat;
      storage.logValidationFailure({ type: 'format', field: 'email' });
      view.setFieldError(error.field, error.message, error.recovery);
      view.focusField('email');
      return;
    }

    try {
      validationService.getPasswordPolicy();
    } catch (error) {
      const unavailable = UI_MESSAGES.errors.passwordUnavailable;
      validationService.logPasswordFailure('unavailable', null);
      view.setFieldError(unavailable.field, unavailable.message, unavailable.recovery);
      view.focusField('password');
      return;
    }

    const passwordResult = validationService.isPasswordValid(password);
    if (!passwordResult.ok) {
      const error = mapPasswordError(passwordResult.reason);
      validationService.logPasswordFailure(passwordResult.reason, null);
      view.setFieldError(error.field, error.message, error.recovery);
      view.focusField('password');
      return;
    }

    if (storage.findByEmail(email)) {
      const error = UI_MESSAGES.errors.emailDuplicate;
      storage.logValidationFailure({ type: 'duplicate', field: 'email' });
      view.setFieldError(error.field, error.message, error.recovery);
      view.focusField('email');
      return;
    }

    let account;
    try {
      account = createUserAccount({ email, password });
    } catch (error) {
      const mapped = error.message === 'password_invalid'
        ? UI_MESSAGES.errors.passwordComplexity
        : UI_MESSAGES.errors.emailFormat;
      view.setFieldError(mapped.field, mapped.message, mapped.recovery);
      view.focusField(mapped.field);
      return;
    }

    try {
      storage.saveAccount(account);
    } catch (error) {
      const failure = UI_MESSAGES.errors.storageFailure;
      view.setStatus(`${failure.message} ${failure.recovery}`.trim(), false);
      return;
    }

    sessionState.authenticate(account);
    const success = UI_MESSAGES.registrationSuccess;
    view.setStatus(`${success.title}. ${success.body}`, true);

    setTimeout(() => {
      if (onRegistrationSuccess) {
        onRegistrationSuccess();
      }
    }, 1500);
  }

  return {
    init() {
      view.onSubmit(handleSubmit);
    },
  };
}
