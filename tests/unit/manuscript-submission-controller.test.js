import { jest } from '@jest/globals';
import { createSubmitManuscriptView } from '../../src/views/submit-manuscript-view.js';
import { createManuscriptSubmissionController } from '../../src/controllers/manuscript-submission-controller.js';
import { UI_MESSAGES } from '../../src/services/ui-messages.js';

function createMocks() {
  return {
    storage: {
      saveSubmission: jest.fn(),
    },
    draftStorage: {
      loadDraft: jest.fn(() => null),
      saveDraft: jest.fn(),
      clearDraft: jest.fn(),
    },
    sessionState: {
      isAuthenticated: jest.fn(() => true),
      getCurrentUser: jest.fn(() => ({ id: 'acct_1', email: 'author@example.com' })),
    },
    errorLogger: {
      logFailure: jest.fn(),
    },
    draftErrorLogger: {
      logFailure: jest.fn(),
    },
  };
}

function setupController(overrides = {}) {
  const view = createSubmitManuscriptView();
  document.body.appendChild(view.element);
  const mocks = createMocks();
  const onSubmitSuccess = overrides.onSubmitSuccess !== undefined
    ? overrides.onSubmitSuccess
    : jest.fn();
  const controller = createManuscriptSubmissionController({
    view,
    storage: overrides.storage || mocks.storage,
    assignmentStorage: overrides.assignmentStorage,
    draftStorage: overrides.draftStorage || mocks.draftStorage,
    sessionState: overrides.sessionState || mocks.sessionState,
    errorLogger: overrides.errorLogger || mocks.errorLogger,
    assignmentErrorLogger: overrides.assignmentErrorLogger,
    draftErrorLogger: Object.prototype.hasOwnProperty.call(overrides, 'draftErrorLogger')
      ? overrides.draftErrorLogger
      : mocks.draftErrorLogger,
    onSubmitSuccess,
    onAuthRequired: overrides.onAuthRequired,
  });
  controller.init();
  return { view, mocks, controller, onSubmitSuccess };
}

function setValues(view, overrides = {}) {
  view.setValues({
    title: 'Paper title',
    authorNames: 'Author One',
    affiliations: 'Institute',
    contactEmail: 'author@example.com',
    abstract: 'Abstract',
    keywords: 'paper, test',
    mainSource: 'file upload',
    ...overrides,
  });
}

function setFile(view, file) {
  const input = view.element.querySelector('#manuscriptFile');
  Object.defineProperty(input, 'files', {
    value: file ? [file] : [],
    writable: false,
  });
}

function submit(view) {
  const event = new Event('submit', { bubbles: true, cancelable: true });
  view.element.querySelector('form').dispatchEvent(event);
}

function makeFile(name, size, type) {
  const file = new File(['content'], name, { type, lastModified: Date.now() });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

test('requireAuth blocks unauthenticated access', () => {
  const sessionState = {
    isAuthenticated: jest.fn(() => false),
    getCurrentUser: jest.fn(() => null),
  };
  const { controller, view } = setupController({ sessionState });
  expect(controller.requireAuth()).toBe(false);
  expect(view.element.querySelector('.status').textContent).toContain('log in');
});

test('requireAuth allows authenticated access', () => {
  const { controller } = setupController();
  expect(controller.requireAuth()).toBe(true);
});

test('shows required field errors', () => {
  const { view } = setupController();
  setValues(view, { title: '' });
  setFile(view, makeFile('paper.pdf', 1000, 'application/pdf'));
  submit(view);
  expect(view.element.querySelector('#title-error').textContent).toContain('required');
});

test('uses fallback label when missing', () => {
  const originalLabel = UI_MESSAGES.labels.title;
  delete UI_MESSAGES.labels.title;
  const { view } = setupController();
  setValues(view, { title: '' });
  setFile(view, makeFile('paper.pdf', 1000, 'application/pdf'));
  submit(view);
  expect(view.element.querySelector('#title-error').textContent).toContain('title');
  UI_MESSAGES.labels.title = originalLabel;
});

test('shows invalid email error', () => {
  const { view } = setupController();
  setValues(view, { contactEmail: 'invalid' });
  setFile(view, makeFile('paper.pdf', 1000, 'application/pdf'));
  submit(view);
  expect(view.element.querySelector('#contactEmail-error').textContent).toContain('invalid');
});

test('shows invalid author names error', () => {
  const { view } = setupController();
  setValues(view, { authorNames: ' , ' });
  setFile(view, makeFile('paper.pdf', 1000, 'application/pdf'));
  submit(view);
  expect(view.element.querySelector('#authorNames-error').textContent).toContain('Author names');
});

test('shows invalid keywords error', () => {
  const { view } = setupController();
  setValues(view, { keywords: 'one, , two' });
  setFile(view, makeFile('paper.pdf', 1000, 'application/pdf'));
  submit(view);
  expect(view.element.querySelector('#keywords-error').textContent).toContain('Keywords');
});

test('requires a file', () => {
  const { view } = setupController();
  setValues(view);
  setFile(view, null);
  submit(view);
  expect(view.element.querySelector('#manuscriptFile-error').textContent)
    .toContain(UI_MESSAGES.errors.fileRequired.message);
});

test('rejects invalid file type', () => {
  const { view } = setupController();
  setValues(view);
  setFile(view, makeFile('paper.exe', 1000, 'application/octet-stream'));
  submit(view);
  expect(view.element.querySelector('#manuscriptFile-error').textContent)
    .toContain(UI_MESSAGES.errors.fileTypeInvalid.message);
});

test('rejects file without extension', () => {
  const { view } = setupController();
  setValues(view);
  setFile(view, makeFile('paper', 1000, 'application/octet-stream'));
  submit(view);
  expect(view.element.querySelector('#manuscriptFile-error').textContent)
    .toContain(UI_MESSAGES.errors.fileTypeInvalid.message);
});

test('rejects oversized file', () => {
  const { view } = setupController();
  setValues(view);
  setFile(view, makeFile('paper.pdf', 8 * 1024 * 1024, 'application/pdf'));
  submit(view);
  expect(view.element.querySelector('#manuscriptFile-error').textContent)
    .toContain(UI_MESSAGES.errors.fileTooLarge.message);
});

test('handles upload failure', () => {
  const { view } = setupController();
  setValues(view);
  const file = makeFile('paper.pdf', 1000, 'application/pdf');
  file.failUpload = true;
  setFile(view, file);
  submit(view);
  expect(view.element.querySelector('#manuscriptFile-error').textContent)
    .toContain(UI_MESSAGES.errors.uploadFailed.message);
});

test('logs storage failure on submit', () => {
  const storage = createMocks().storage;
  storage.saveSubmission = jest.fn(() => {
    throw new Error('storage_failure');
  });
  const errorLogger = { logFailure: jest.fn() };
  const { view } = setupController({ storage, errorLogger });
  setValues(view);
  setFile(view, makeFile('paper.pdf', 1000, 'application/pdf'));
  submit(view);
  expect(view.element.querySelector('.status').textContent).toContain('unavailable');
  expect(errorLogger.logFailure).toHaveBeenCalled();
});

test('seeds assignment paper after successful submission', () => {
  const assignmentStorage = {
    getPaper: jest.fn(() => null),
    seedPaper: jest.fn(),
  };
  const { view } = setupController({ assignmentStorage });
  setValues(view);
  setFile(view, makeFile('paper.pdf', 1000, 'application/pdf'));
  submit(view);
  expect(assignmentStorage.seedPaper).toHaveBeenCalledWith(expect.objectContaining({
    id: expect.any(String),
    title: 'Paper title',
    status: 'submitted',
  }));
});

test('uses contact email when submittedBy is missing', () => {
  const assignmentStorage = {
    getPaper: jest.fn(() => null),
    seedPaper: jest.fn(),
  };
  const sessionState = {
    isAuthenticated: jest.fn(() => true),
    getCurrentUser: jest.fn(() => null),
  };
  const { view } = setupController({ assignmentStorage, sessionState });
  setValues(view, { contactEmail: 'contact@example.com' });
  setFile(view, makeFile('paper.pdf', 1000, 'application/pdf'));
  submit(view);
  expect(assignmentStorage.seedPaper).toHaveBeenCalledWith(expect.objectContaining({
    authorIds: ['contact@example.com'],
  }));
});

test('skips seeding when assignment paper already exists', () => {
  const assignmentStorage = {
    getPaper: jest.fn(() => ({ id: 'existing' })),
    seedPaper: jest.fn(),
  };
  const { view } = setupController({ assignmentStorage });
  setValues(view);
  setFile(view, makeFile('paper.pdf', 1000, 'application/pdf'));
  submit(view);
  expect(assignmentStorage.seedPaper).not.toHaveBeenCalled();
});

test('logs assignment seed failure without blocking submission', () => {
  const assignmentStorage = {
    getPaper: jest.fn(() => {
      throw new Error('assignment_failure');
    }),
    seedPaper: jest.fn(),
  };
  const assignmentErrorLogger = { logFailure: jest.fn() };
  const { view, onSubmitSuccess } = setupController({ assignmentStorage, assignmentErrorLogger });
  setValues(view);
  setFile(view, makeFile('paper.pdf', 1000, 'application/pdf'));
  submit(view);
  expect(assignmentErrorLogger.logFailure).toHaveBeenCalled();
  expect(view.element.querySelector('.status').textContent).toContain('Submission');
  expect(onSubmitSuccess).toHaveBeenCalled();
});

test('logs default assignment seed failure message when error lacks message', () => {
  const assignmentStorage = {
    getPaper: jest.fn(() => {
      throw {};
    }),
    seedPaper: jest.fn(),
  };
  const assignmentErrorLogger = { logFailure: jest.fn() };
  const { view } = setupController({ assignmentStorage, assignmentErrorLogger });
  setValues(view);
  setFile(view, makeFile('paper.pdf', 1000, 'application/pdf'));
  submit(view);
  expect(assignmentErrorLogger.logFailure).toHaveBeenCalledWith(expect.objectContaining({
    message: 'assignment_seed_failed',
  }));
  expect(view.element.querySelector('.status').textContent).toContain('Submission');
});

test('ignores assignment seed failure when logger is missing', () => {
  const assignmentStorage = {
    getPaper: jest.fn(() => {
      throw new Error('assignment_failure');
    }),
    seedPaper: jest.fn(),
  };
  const { view } = setupController({ assignmentStorage, assignmentErrorLogger: null });
  setValues(view);
  setFile(view, makeFile('paper.pdf', 1000, 'application/pdf'));
  submit(view);
  expect(view.element.querySelector('.status').textContent).toContain('Submission');
});

test('skips draft clearing when user key missing', () => {
  const sessionState = {
    isAuthenticated: jest.fn(() => true),
    getCurrentUser: jest.fn(() => null),
  };
  const draftStorage = createMocks().draftStorage;
  const { view } = setupController({ draftStorage, sessionState });
  setValues(view);
  setFile(view, makeFile('paper.pdf', 1000, 'application/pdf'));
  submit(view);
  expect(draftStorage.clearDraft).not.toHaveBeenCalled();
  expect(view.element.querySelector('.status').textContent).toContain('Submission');
});

test('saves draft even when fields are incomplete', () => {
  const { view, mocks } = setupController();
  setValues(view, { title: '', contactEmail: '' });
  view.element.querySelector('#save-draft').click();
  expect(mocks.draftStorage.saveDraft).toHaveBeenCalled();
  expect(view.element.querySelector('.status').textContent).toContain('Draft saved');
  expect(view.element.querySelector('#draft-warning').textContent).toContain('incomplete');
});

test('draft warning uses fallback label when missing', () => {
  const originalLabel = UI_MESSAGES.labels.title;
  delete UI_MESSAGES.labels.title;
  const { view } = setupController();
  setValues(view, { title: '' });
  view.element.querySelector('#save-draft').click();
  expect(view.element.querySelector('#draft-warning').textContent).toContain('title');
  UI_MESSAGES.labels.title = originalLabel;
});

test('draft save clears warning when fields are complete', () => {
  const { view } = setupController();
  setValues(view);
  view.element.querySelector('#save-draft').click();
  expect(view.element.querySelector('#draft-warning').textContent).toBe('');
});

test('draft save blocks unauthenticated users and triggers auth callback', () => {
  const sessionState = {
    isAuthenticated: jest.fn(() => true),
    getCurrentUser: jest.fn(() => null),
  };
  const onAuthRequired = jest.fn();
  const { view } = setupController({ sessionState, onAuthRequired });
  setValues(view, { title: 'Draft title', contactEmail: 'author@example.com' });
  view.element.querySelector('#save-draft').click();
  expect(view.element.querySelector('.status').textContent).toContain('log in');
  expect(onAuthRequired).toHaveBeenCalled();
});

test('draft save blocks unauthenticated users without auth callback', () => {
  const sessionState = {
    isAuthenticated: jest.fn(() => true),
    getCurrentUser: jest.fn(() => null),
  };
  const { view } = setupController({ sessionState, onAuthRequired: null });
  setValues(view, { title: 'Draft title', contactEmail: 'author@example.com' });
  view.element.querySelector('#save-draft').click();
  expect(view.element.querySelector('.status').textContent).toContain('log in');
});

test('draft save logs storage failure', () => {
  const draftStorage = createMocks().draftStorage;
  draftStorage.saveDraft = jest.fn(() => {
    throw new Error('draft_save_failure');
  });
  const draftErrorLogger = { logFailure: jest.fn() };
  const { view } = setupController({ draftStorage, draftErrorLogger });
  setValues(view, { title: 'Draft title', contactEmail: 'author@example.com' });
  view.element.querySelector('#save-draft').click();
  expect(view.element.querySelector('.status').textContent).toContain('unavailable');
  expect(draftErrorLogger.logFailure).toHaveBeenCalled();
});

test('draft save failure without logger still shows error', () => {
  const draftStorage = createMocks().draftStorage;
  draftStorage.saveDraft = jest.fn(() => {
    throw new Error('draft_save_failure');
  });
  const { view } = setupController({ draftStorage, draftErrorLogger: null });
  setValues(view);
  view.element.querySelector('#save-draft').click();
  expect(view.element.querySelector('.status').textContent).toContain('unavailable');
});

test('loads draft on init', () => {
  const draftStorage = createMocks().draftStorage;
  draftStorage.loadDraft = jest.fn(() => ({
    draftData: {
      title: 'Loaded draft',
      authorNames: 'Author',
      affiliations: 'Institute',
      contactEmail: 'author@example.com',
      abstract: 'Abstract',
      keywords: 'one, two',
      mainSource: 'file upload',
    },
    draftFileMetadata: { originalName: 'draft.pdf', fileType: 'pdf', fileSizeBytes: 100 },
    savedAt: '2026-02-02T10:00:00.000Z',
  }));
  const { view } = setupController({ draftStorage });
  expect(view.element.querySelector('#title').value).toBe('Loaded draft');
  expect(view.element.querySelector('#draft-attachment-status').textContent).toContain('draft.pdf');
});

test('loads draft without saved timestamp', () => {
  const draftStorage = createMocks().draftStorage;
  draftStorage.loadDraft = jest.fn(() => ({
    draftData: { title: 'Loaded draft', contactEmail: 'author@example.com' },
    draftFileMetadata: null,
    savedAt: null,
  }));
  const { view } = setupController({ draftStorage });
  expect(view.element.querySelector('#draft-indicator').textContent).toBe('');
});

test('ignores draft when restored data is missing', () => {
  const draftStorage = createMocks().draftStorage;
  draftStorage.loadDraft = jest.fn(() => ({ draftData: null, draftFileMetadata: null }));
  const { view } = setupController({ draftStorage });
  expect(view.element.querySelector('#title').value).toBe('');
});

test('load failure sets form to read-only', () => {
  const draftStorage = createMocks().draftStorage;
  draftStorage.loadDraft = jest.fn(() => {
    throw new Error('draft_load_failure');
  });
  const draftErrorLogger = { logFailure: jest.fn() };
  const { view } = setupController({ draftStorage, draftErrorLogger });
  expect(view.element.querySelector('.status').textContent).toContain('unavailable');
  expect(view.element.querySelector('#title').disabled).toBe(true);
  expect(draftErrorLogger.logFailure).toHaveBeenCalled();
});

test('load failure without logger still blocks editing', () => {
  const draftStorage = createMocks().draftStorage;
  draftStorage.loadDraft = jest.fn(() => {
    throw new Error('draft_load_failure');
  });
  const { view } = setupController({ draftStorage, draftErrorLogger: null });
  expect(view.element.querySelector('.status').textContent).toContain('unavailable');
  expect(view.element.querySelector('#title').disabled).toBe(true);
});

test('submit succeeds without onSubmitSuccess callback', () => {
  const { view } = setupController({ onSubmitSuccess: null });
  setValues(view);
  setFile(view, makeFile('paper.pdf', 1000, 'application/pdf'));
  submit(view);
  expect(view.element.querySelector('.status').textContent).toContain('Submission');
});
