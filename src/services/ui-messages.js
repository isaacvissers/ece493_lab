export const UI_MESSAGES = {
  success: {
    title: 'Login successful',
    body: 'Redirecting you to your home page.',
  },
  errors: {
    required: (field) => ({
      code: 'required',
      field,
      message: `${field} is required.`,
      recovery: `Enter a valid ${field}.`,
    }),
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
