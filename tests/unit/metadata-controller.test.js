import { jest } from '@jest/globals';

function createViewStub() {
  let submitHandler = null;
  let draftHandler = null;
  return {
    view: {
      clearErrors: jest.fn(),
      getValues: jest.fn(() => ({})),
      setFieldError: jest.fn(),
      setStatus: jest.fn(),
      setEditable: jest.fn(),
      setValues: jest.fn(),
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

test('requireAuth blocks unauthenticated users', async () => {
  jest.resetModules();
  const { createMetadataController } = await import('../../src/controllers/metadata-controller.js');
  const { view } = createViewStub();
  const controller = createMetadataController({
    view,
    storage: { loadMetadata: () => null, loadDraft: () => null, isFinalized: () => false },
    sessionState: { isAuthenticated: () => false, getCurrentUser: () => null },
    errorLogger: { logFailure: jest.fn() },
  });
  expect(controller.requireAuth()).toBe(false);
  expect(view.setStatus).toHaveBeenCalled();
});

test('requireAuth allows authenticated users', async () => {
  jest.resetModules();
  const { createMetadataController } = await import('../../src/controllers/metadata-controller.js');
  const { view } = createViewStub();
  const controller = createMetadataController({
    view,
    storage: { loadMetadata: () => null, loadDraft: () => null, isFinalized: () => false },
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'user@example.com' }) },
    errorLogger: { logFailure: jest.fn() },
  });
  expect(controller.requireAuth()).toBe(true);
});

test('draft validation errors map to fields', async () => {
  jest.resetModules();
  jest.unstable_mockModule('../../src/services/metadata-validation.js', () => ({
    validateMetadata: () => ({
      ok: false,
      errors: {
        authorNames: 'required',
        contactEmail: 'invalid_email',
        keywords: 'invalid_keywords',
        mainSource: 'invalid_source',
        abstract: 'abstract_too_long',
        affiliations: 'invalid_affiliations',
      },
    }),
  }));
  const { createMetadataController } = await import('../../src/controllers/metadata-controller.js');
  const { UI_MESSAGES } = await import('../../src/services/ui-messages.js');
  const { view, triggerDraft } = createViewStub();
  const controller = createMetadataController({
    view,
    storage: { loadMetadata: () => null, loadDraft: () => null, isFinalized: () => false },
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'user@example.com' }) },
    errorLogger: { logFailure: jest.fn() },
  });
  controller.init();
  triggerDraft();
  expect(view.setFieldError).toHaveBeenCalledWith(
    'authorNames',
    expect.stringContaining('required'),
    expect.stringContaining('Enter a valid'),
  );
  expect(view.setFieldError).toHaveBeenCalledWith(
    'mainSource',
    UI_MESSAGES.errors.mainSourceInvalid.message,
    UI_MESSAGES.errors.mainSourceInvalid.recovery,
  );
  expect(view.setFieldError).toHaveBeenCalledWith(
    'abstract',
    UI_MESSAGES.errors.abstractTooLong.message,
    UI_MESSAGES.errors.abstractTooLong.recovery,
  );
  expect(view.setFieldError).toHaveBeenCalledWith(
    'contactEmail',
    UI_MESSAGES.errors.emailFormat.message,
    UI_MESSAGES.errors.emailFormat.recovery,
  );
  expect(view.setFieldError).toHaveBeenCalledWith(
    'keywords',
    UI_MESSAGES.errors.keywordsInvalid.message,
    UI_MESSAGES.errors.keywordsInvalid.recovery,
  );
});

test('required error uses fallback label for unknown field', async () => {
  jest.resetModules();
  jest.unstable_mockModule('../../src/services/metadata-validation.js', () => ({
    validateMetadata: () => ({ ok: false, errors: { unknownField: 'required' } }),
  }));
  const { createMetadataController } = await import('../../src/controllers/metadata-controller.js');
  const { view, triggerSubmit } = createViewStub();
  const controller = createMetadataController({
    view,
    storage: { loadMetadata: () => null, loadDraft: () => null, isFinalized: () => false },
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'user@example.com' }) },
    errorLogger: { logFailure: jest.fn() },
  });
  controller.init();
  triggerSubmit();
  expect(view.setFieldError).toHaveBeenCalledWith(
    'unknownField',
    expect.stringContaining('unknownField'),
    expect.any(String),
  );
});

test('draft save logs failure on storage error', async () => {
  jest.resetModules();
  jest.unstable_mockModule('../../src/services/metadata-validation.js', () => ({
    validateMetadata: () => ({ ok: true, values: { authorNames: 'Author' } }),
  }));
  const { createMetadataController } = await import('../../src/controllers/metadata-controller.js');
  const { UI_MESSAGES } = await import('../../src/services/ui-messages.js');
  const { view, triggerDraft } = createViewStub();
  const errorLogger = { logFailure: jest.fn() };
  const controller = createMetadataController({
    view,
    storage: {
      loadMetadata: () => null,
      loadDraft: () => null,
      isFinalized: () => false,
      saveDraft: () => { throw new Error('fail'); },
    },
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'user@example.com' }) },
    errorLogger,
  });
  controller.init();
  triggerDraft();
  expect(errorLogger.logFailure).toHaveBeenCalled();
  expect(view.setStatus).toHaveBeenCalledWith(UI_MESSAGES.errors.metadataUnavailable.message, true);
});

test('draft save blocks unauthenticated users', async () => {
  jest.resetModules();
  jest.unstable_mockModule('../../src/services/metadata-validation.js', () => ({
    validateMetadata: () => ({ ok: true, values: { authorNames: 'Author' } }),
  }));
  const { createMetadataController } = await import('../../src/controllers/metadata-controller.js');
  const { UI_MESSAGES } = await import('../../src/services/ui-messages.js');
  const { view, triggerDraft } = createViewStub();
  const controller = createMetadataController({
    view,
    storage: {
      loadMetadata: () => null,
      loadDraft: () => null,
      isFinalized: () => false,
      saveDraft: jest.fn(),
    },
    sessionState: { isAuthenticated: () => false, getCurrentUser: () => null },
    errorLogger: { logFailure: jest.fn() },
  });
  controller.init();
  triggerDraft();
  expect(view.setStatus).toHaveBeenCalledWith(UI_MESSAGES.errors.accessDenied.message, true);
});

test('submit save logs failure on storage error', async () => {
  jest.resetModules();
  jest.unstable_mockModule('../../src/services/metadata-validation.js', () => ({
    validateMetadata: () => ({ ok: true, values: { authorNames: 'Author' } }),
  }));
  const { createMetadataController } = await import('../../src/controllers/metadata-controller.js');
  const { UI_MESSAGES } = await import('../../src/services/ui-messages.js');
  const { view, triggerSubmit } = createViewStub();
  const errorLogger = { logFailure: jest.fn() };
  const controller = createMetadataController({
    view,
    storage: {
      loadMetadata: () => null,
      loadDraft: () => null,
      isFinalized: () => false,
      saveMetadata: () => { throw new Error('fail'); },
      clearDraft: jest.fn(),
    },
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'user@example.com' }) },
    errorLogger,
  });
  controller.init();
  triggerSubmit();
  expect(errorLogger.logFailure).toHaveBeenCalled();
  expect(view.setStatus).toHaveBeenCalledWith(UI_MESSAGES.errors.metadataUnavailable.message, true);
});

test('submit save blocks unauthenticated users', async () => {
  jest.resetModules();
  jest.unstable_mockModule('../../src/services/metadata-validation.js', () => ({
    validateMetadata: () => ({ ok: true, values: { authorNames: 'Author' } }),
  }));
  const { createMetadataController } = await import('../../src/controllers/metadata-controller.js');
  const { UI_MESSAGES } = await import('../../src/services/ui-messages.js');
  const { view, triggerSubmit } = createViewStub();
  const controller = createMetadataController({
    view,
    storage: {
      loadMetadata: () => null,
      loadDraft: () => null,
      isFinalized: () => false,
      saveMetadata: jest.fn(),
      clearDraft: jest.fn(),
    },
    sessionState: { isAuthenticated: () => false, getCurrentUser: () => null },
    errorLogger: { logFailure: jest.fn() },
  });
  controller.init();
  triggerSubmit();
  expect(view.setStatus).toHaveBeenCalledWith(UI_MESSAGES.errors.accessDenied.message, true);
});

test('init loads saved metadata and draft', async () => {
  jest.resetModules();
  const { createMetadataController } = await import('../../src/controllers/metadata-controller.js');
  const { view } = createViewStub();
  const controller = createMetadataController({
    view,
    storage: {
      loadMetadata: () => ({ metadata: { authorNames: 'Saved' }, finalized: true }),
      loadDraft: () => ({ submissionId: 'sub_1', draftData: { affiliations: 'Draft' } }),
      isFinalized: () => true,
    },
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'user@example.com' }) },
    errorLogger: { logFailure: jest.fn() },
  });
  controller.init();
  expect(view.setValues).toHaveBeenCalledWith({ authorNames: 'Saved' });
  expect(view.setEditable).toHaveBeenCalledWith(false);
  expect(view.setStatus).toHaveBeenCalled();
});

test('init skips draft restore when invalid', async () => {
  jest.resetModules();
  const { createMetadataController } = await import('../../src/controllers/metadata-controller.js');
  const { view } = createViewStub();
  const controller = createMetadataController({
    view,
    storage: {
      loadMetadata: () => ({ metadata: { authorNames: 'Saved' }, finalized: false }),
      loadDraft: () => ({ submissionId: 'sub_2' }),
      isFinalized: () => false,
    },
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'user@example.com' }) },
    errorLogger: { logFailure: jest.fn() },
  });
  controller.init();
  expect(view.setEditable).not.toHaveBeenCalledWith(false);
});
