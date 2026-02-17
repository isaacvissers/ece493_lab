import { jest } from '@jest/globals';

function createViewStub() {
  let submitHandler = null;
  let draftHandler = null;
  return {
    view: {
      clearErrors: jest.fn(),
      getValues: jest.fn(() => ({})),
      getFile: jest.fn(() => null),
      setFieldError: jest.fn(),
      setStatus: jest.fn(),
      onSubmit: (handler) => { submitHandler = handler; },
      onSaveDraft: (handler) => { draftHandler = handler; },
    },
    triggerSubmit() {
      submitHandler({ preventDefault: jest.fn() });
    },
    triggerDraft() {
      draftHandler();
    },
  };
}

test('submit blocks unauthenticated users', async () => {
  jest.resetModules();
  const { createSubmissionValidationController } = await import('../../src/controllers/submission-validation-controller.js');
  const { UI_MESSAGES } = await import('../../src/services/ui-messages.js');
  const { view, triggerSubmit } = createViewStub();
  const controller = createSubmissionValidationController({
    view,
    sessionState: { isAuthenticated: () => false },
  });
  controller.init();
  triggerSubmit();
  expect(view.setStatus).toHaveBeenCalledWith(UI_MESSAGES.errors.accessDenied.message, true);
});

test('draft blocks unauthenticated users', async () => {
  jest.resetModules();
  const { createSubmissionValidationController } = await import('../../src/controllers/submission-validation-controller.js');
  const { UI_MESSAGES } = await import('../../src/services/ui-messages.js');
  const { view, triggerDraft } = createViewStub();
  const controller = createSubmissionValidationController({
    view,
    sessionState: { isAuthenticated: () => false },
  });
  controller.init();
  triggerDraft();
  expect(view.setStatus).toHaveBeenCalledWith(UI_MESSAGES.errors.accessDenied.message, true);
});

test('required error uses fallback label', async () => {
  jest.resetModules();
  jest.unstable_mockModule('../../src/services/submission-validation.js', () => ({
    validateSubmission: () => ({ ok: false, errors: { unknownField: 'required' }, values: {} }),
  }));
  const { createSubmissionValidationController } = await import('../../src/controllers/submission-validation-controller.js');
  const { view, triggerSubmit } = createViewStub();
  const controller = createSubmissionValidationController({
    view,
    sessionState: { isAuthenticated: () => true },
  });
  controller.init();
  triggerSubmit();
  expect(view.setFieldError).toHaveBeenCalledWith(
    'unknownField',
    expect.stringContaining('unknownField'),
    expect.any(String),
  );
});

test('maps file required and invalid type errors', async () => {
  jest.resetModules();
  jest.unstable_mockModule('../../src/services/submission-validation.js', () => ({
    validateSubmission: () => ({
      ok: false,
      errors: {
        manuscriptFile: 'file_required',
        contactEmail: 'invalid_email',
      },
      values: {},
    }),
  }));
  const { createSubmissionValidationController } = await import('../../src/controllers/submission-validation-controller.js');
  const { UI_MESSAGES } = await import('../../src/services/ui-messages.js');
  const { view, triggerSubmit } = createViewStub();
  const controller = createSubmissionValidationController({
    view,
    sessionState: { isAuthenticated: () => true },
  });
  controller.init();
  triggerSubmit();
  expect(view.setFieldError).toHaveBeenCalledWith(
    'manuscriptFile',
    UI_MESSAGES.errors.fileRequired.message,
    UI_MESSAGES.errors.fileRequired.recovery,
  );
  expect(view.setFieldError).toHaveBeenCalledWith(
    'contactEmail',
    UI_MESSAGES.errors.emailFormat.message,
    UI_MESSAGES.errors.emailFormat.recovery,
  );
});

test('maps file type invalid error', async () => {
  jest.resetModules();
  jest.unstable_mockModule('../../src/services/submission-validation.js', () => ({
    validateSubmission: () => ({ ok: false, errors: { manuscriptFile: 'file_type_invalid' }, values: {} }),
  }));
  const { createSubmissionValidationController } = await import('../../src/controllers/submission-validation-controller.js');
  const { UI_MESSAGES } = await import('../../src/services/ui-messages.js');
  const { view, triggerSubmit } = createViewStub();
  const controller = createSubmissionValidationController({
    view,
    sessionState: { isAuthenticated: () => true },
  });
  controller.init();
  triggerSubmit();
  expect(view.setFieldError).toHaveBeenCalledWith(
    'manuscriptFile',
    UI_MESSAGES.errors.fileTypeInvalid.message,
    UI_MESSAGES.errors.fileTypeInvalid.recovery,
  );
});

test('successful submit triggers success handler', async () => {
  jest.resetModules();
  jest.unstable_mockModule('../../src/services/submission-validation.js', () => ({
    validateSubmission: () => ({ ok: true, errors: {}, values: { authorNames: 'Author' } }),
  }));
  const { createSubmissionValidationController } = await import('../../src/controllers/submission-validation-controller.js');
  const { UI_MESSAGES } = await import('../../src/services/ui-messages.js');
  const { view, triggerSubmit } = createViewStub();
  const onSubmitSuccess = jest.fn();
  const controller = createSubmissionValidationController({
    view,
    sessionState: { isAuthenticated: () => true },
    onSubmitSuccess,
  });
  controller.init();
  triggerSubmit();
  expect(view.setStatus).toHaveBeenCalledWith(UI_MESSAGES.submissionValidated.body, false);
  expect(onSubmitSuccess).toHaveBeenCalled();
});

test('successful submit without handler still sets status', async () => {
  jest.resetModules();
  jest.unstable_mockModule('../../src/services/submission-validation.js', () => ({
    validateSubmission: () => ({ ok: true, errors: {}, values: { authorNames: 'Author' } }),
  }));
  const { createSubmissionValidationController } = await import('../../src/controllers/submission-validation-controller.js');
  const { UI_MESSAGES } = await import('../../src/services/ui-messages.js');
  const { view, triggerSubmit } = createViewStub();
  const controller = createSubmissionValidationController({
    view,
    sessionState: { isAuthenticated: () => true },
  });
  controller.init();
  triggerSubmit();
  expect(view.setStatus).toHaveBeenCalledWith(UI_MESSAGES.submissionValidated.body, false);
});

test('draft save success shows status', async () => {
  jest.resetModules();
  jest.unstable_mockModule('../../src/services/submission-validation.js', () => ({
    validateSubmission: () => ({ ok: true, errors: {}, values: {} }),
  }));
  const { createSubmissionValidationController } = await import('../../src/controllers/submission-validation-controller.js');
  const { UI_MESSAGES } = await import('../../src/services/ui-messages.js');
  const { view, triggerDraft } = createViewStub();
  const controller = createSubmissionValidationController({
    view,
    sessionState: { isAuthenticated: () => true },
  });
  controller.init();
  triggerDraft();
  expect(view.setStatus).toHaveBeenCalledWith(UI_MESSAGES.draftSaved.body, false);
});

test('requireAuth returns true for authenticated users', async () => {
  jest.resetModules();
  const { createSubmissionValidationController } = await import('../../src/controllers/submission-validation-controller.js');
  const { view } = createViewStub();
  const controller = createSubmissionValidationController({
    view,
    sessionState: { isAuthenticated: () => true },
  });
  expect(controller.requireAuth()).toBe(true);
});

test('requireAuth returns false for unauthenticated users', async () => {
  jest.resetModules();
  const { createSubmissionValidationController } = await import('../../src/controllers/submission-validation-controller.js');
  const { UI_MESSAGES } = await import('../../src/services/ui-messages.js');
  const { view } = createViewStub();
  const controller = createSubmissionValidationController({
    view,
    sessionState: { isAuthenticated: () => false },
  });
  expect(controller.requireAuth()).toBe(false);
  expect(view.setStatus).toHaveBeenCalledWith(UI_MESSAGES.errors.accessDenied.message, true);
});

test('ignores unknown non-required validation error', async () => {
  jest.resetModules();
  jest.unstable_mockModule('../../src/services/submission-validation.js', () => ({
    validateSubmission: () => ({ ok: false, errors: { otherField: 'bad' }, values: {} }),
  }));
  const { createSubmissionValidationController } = await import('../../src/controllers/submission-validation-controller.js');
  const { view, triggerSubmit } = createViewStub();
  const controller = createSubmissionValidationController({
    view,
    sessionState: { isAuthenticated: () => true },
  });
  controller.init();
  triggerSubmit();
  expect(view.setFieldError).not.toHaveBeenCalled();
});
