export const UI_MESSAGES = {
  loginSuccess: {
    title: 'Login successful',
    body: 'Redirecting you to your home page.',
  },
  registrationSuccess: {
    title: 'Registration complete',
    body: 'Signing you in and taking you to your dashboard.',
  },
  changePasswordSuccess: {
    title: 'Password updated',
    body: 'Your password has been changed.',
  },
  errors: {
    required: (field) => ({
      code: 'required',
      field,
      message: `${field} is required.`,
      recovery: `Enter a valid ${field}.`,
    }),
    emailFormat: {
      code: 'email_invalid',
      field: 'email',
      message: 'Email format is invalid.',
      recovery: 'Use one "@" and include a dot in the domain.',
    },
    emailDuplicate: {
      code: 'email_duplicate',
      field: 'email',
      message: 'Email is already registered.',
      recovery: 'Use a different email or sign in.',
    },
    passwordTooShort: {
      code: 'password_too_short',
      field: 'password',
      message: 'Password is too short.',
      recovery: 'Use at least 8 characters.',
    },
    passwordComplexity: {
      code: 'password_complexity',
      field: 'password',
      message: 'Password must include a number and a symbol.',
      recovery: 'Add at least one number and one symbol.',
    },
    passwordDisallowed: {
      code: 'password_disallowed',
      field: 'password',
      message: 'Password contains disallowed content.',
      recovery: 'Remove spaces or control characters.',
    },
    passwordUnavailable: {
      code: 'password_unavailable',
      field: 'password',
      message: 'Password validation is unavailable. Try again later.',
      recovery: 'Try again after a moment.',
    },
    currentPasswordIncorrect: {
      code: 'current_password_incorrect',
      field: 'currentPassword',
      message: 'Current password is incorrect.',
      recovery: 'Check your password and try again.',
    },
    passwordMismatch: {
      code: 'password_mismatch',
      field: 'confirmPassword',
      message: 'Passwords do not match.',
      recovery: 'Make sure the passwords match.',
    },
    passwordChangeUnavailable: {
      code: 'password_change_unavailable',
      field: null,
      message: 'Password change is temporarily unavailable. Try again later.',
      recovery: 'Please wait a moment and retry.',
    },
    storageFailure: {
      code: 'storage_failure',
      field: null,
      message: 'We could not save your account.',
      recovery: 'Please try again.',
    },
    invalidCredentials: {
      code: 'invalid_credentials',
      field: null,
      message: 'Invalid email or password.',
      recovery: 'Check your credentials and try again.',
    },
    loginUnavailable: {
      code: 'login_unavailable',
      field: null,
      message: 'Login is temporarily unavailable. Try again later.',
      recovery: 'Please wait a moment and retry.',
    },
    accessDenied: {
      code: 'access_denied',
      field: null,
      message: 'Please log in to access this page.',
      recovery: 'Sign in to continue.',
    },
  },
};
