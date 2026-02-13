import { jest } from '@jest/globals';

function createViewStub() {
  let submitHandler = null;
  let changeHandler = null;
  return {
    view: {
      clearErrors: jest.fn(),
      getFiles: jest.fn(),
      setFieldError: jest.fn(),
      focusField: jest.fn(),
      setStatus: jest.fn(),
      setAttachment: jest.fn(),
      onSubmit: (handler) => { submitHandler = handler; },
      onFileChange: (handler) => { changeHandler = handler; },
    },
    triggerSubmit() {
      submitHandler({ preventDefault: jest.fn() });
    },
    triggerChange() {
      changeHandler();
    },
  };
}

test('unknown validation error maps to upload failed', async () => {
  jest.resetModules();
  jest.unstable_mockModule('../../src/models/manuscript-file.js', () => ({
    validateManuscriptFile: () => ({ ok: false, error: { code: 'unknown' } }),
    createManuscriptFile: jest.fn(),
  }));
  const { createFileUploadController } = await import('../../src/controllers/file-upload-controller.js');
  const { UI_MESSAGES } = await import('../../src/services/ui-messages.js');
  const { view, triggerSubmit } = createViewStub();
  view.getFiles.mockReturnValue([{ name: 'bad.bin', size: 10 }]);

  const controller = createFileUploadController({
    view,
    storage: { getAttachment: () => null },
    sessionState: { getCurrentUser: () => ({ email: 'user@example.com' }), isAuthenticated: () => true },
    errorLogger: { logFailure: jest.fn() },
  });
  controller.init();
  triggerSubmit();
  expect(view.setFieldError).toHaveBeenCalledWith(
    'manuscriptFile',
    UI_MESSAGES.errors.uploadFailed.message,
    UI_MESSAGES.errors.uploadFailed.recovery,
  );
});

test('file change shows validation error', async () => {
  jest.resetModules();
  jest.unstable_mockModule('../../src/models/manuscript-file.js', () => ({
    validateManuscriptFile: () => ({ ok: false, error: { code: 'file_type_invalid' } }),
    createManuscriptFile: jest.fn(),
  }));
  const { createFileUploadController } = await import('../../src/controllers/file-upload-controller.js');
  const { UI_MESSAGES } = await import('../../src/services/ui-messages.js');
  const { view, triggerChange } = createViewStub();
  view.getFiles.mockReturnValue([{ name: 'bad.txt', size: 100 }]);
  const controller = createFileUploadController({
    view,
    storage: { getAttachment: () => null },
    sessionState: { getCurrentUser: () => ({ email: 'user@example.com' }), isAuthenticated: () => true },
    errorLogger: { logFailure: jest.fn() },
  });
  controller.init();
  triggerChange();
  expect(view.setFieldError).toHaveBeenCalledWith(
    'manuscriptFile',
    UI_MESSAGES.errors.fileTypeInvalid.message,
    UI_MESSAGES.errors.fileTypeInvalid.recovery,
  );
});

test('file change with valid file does not set an error', async () => {
  jest.resetModules();
  jest.unstable_mockModule('../../src/models/manuscript-file.js', () => ({
    validateManuscriptFile: () => ({ ok: true }),
    createManuscriptFile: jest.fn(),
  }));
  const { createFileUploadController } = await import('../../src/controllers/file-upload-controller.js');
  const { view, triggerChange } = createViewStub();
  view.getFiles.mockReturnValue([{ name: 'valid.pdf', size: 100 }]);
  const controller = createFileUploadController({
    view,
    storage: { getAttachment: () => null },
    sessionState: { getCurrentUser: () => ({ email: 'user@example.com' }), isAuthenticated: () => true },
    errorLogger: { logFailure: jest.fn() },
  });
  controller.init();
  triggerChange();
  expect(view.setFieldError).not.toHaveBeenCalled();
});
