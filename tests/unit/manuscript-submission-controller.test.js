import { jest } from '@jest/globals';
import { createSubmitManuscriptView } from '../../src/views/submit-manuscript-view.js';
import { createManuscriptSubmissionController } from '../../src/controllers/manuscript-submission-controller.js';
import { UI_MESSAGES } from '../../src/services/ui-messages.js';

function createMocks() {
  return {
    storage: {
      loadDraft: jest.fn(() => null),
      saveDraft: jest.fn(),
      saveSubmission: jest.fn(),
      clearDraft: jest.fn(),
    },
    sessionState: {
      isAuthenticated: jest.fn(() => true),
      getCurrentUser: jest.fn(() => ({ id: 'acct_1', email: 'author@example.com' })),
    },
    errorLogger: {
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
    sessionState: overrides.sessionState || mocks.sessionState,
    errorLogger: overrides.errorLogger || mocks.errorLogger,
    onSubmitSuccess,
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
    mainSource: 'Main source',
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

test('skips draft clearing when user key missing', () => {
  const sessionState = {
    isAuthenticated: jest.fn(() => true),
    getCurrentUser: jest.fn(() => null),
  };
  const storage = createMocks().storage;
  const { view } = setupController({ storage, sessionState });
  setValues(view);
  setFile(view, makeFile('paper.pdf', 1000, 'application/pdf'));
  submit(view);
  expect(storage.clearDraft).not.toHaveBeenCalled();
  expect(view.element.querySelector('.status').textContent).toContain('Submission');
});

test('saves draft when minimal fields provided', () => {
  const { view, mocks } = setupController();
  setValues(view, { title: 'Draft title', contactEmail: 'author@example.com' });
  view.element.querySelector('#save-draft').click();
  expect(mocks.storage.saveDraft).toHaveBeenCalled();
  expect(view.element.querySelector('.status').textContent).toContain('draft');
});

test('draft save shows errors when missing fields', () => {
  const { view } = setupController();
  setValues(view, { title: '', contactEmail: '' });
  view.element.querySelector('#save-draft').click();
  expect(view.element.querySelector('#title-error').textContent).toContain('required');
});

test('draft save blocks unauthenticated users', () => {
  const sessionState = {
    isAuthenticated: jest.fn(() => true),
    getCurrentUser: jest.fn(() => null),
  };
  const { view } = setupController({ sessionState });
  setValues(view, { title: 'Draft title', contactEmail: 'author@example.com' });
  view.element.querySelector('#save-draft').click();
  expect(view.element.querySelector('.status').textContent).toContain('log in');
});

test('draft save logs storage failure', () => {
  const storage = createMocks().storage;
  storage.saveDraft = jest.fn(() => {
    throw new Error('storage_failure');
  });
  const errorLogger = { logFailure: jest.fn() };
  const { view } = setupController({ storage, errorLogger });
  setValues(view, { title: 'Draft title', contactEmail: 'author@example.com' });
  view.element.querySelector('#save-draft').click();
  expect(view.element.querySelector('.status').textContent).toContain('unavailable');
  expect(errorLogger.logFailure).toHaveBeenCalled();
});

test('loads draft on init', () => {
  const storage = createMocks().storage;
  storage.loadDraft = jest.fn(() => ({
    draftData: {
      title: 'Loaded draft',
      authorNames: 'Author',
      affiliations: 'Institute',
      contactEmail: 'author@example.com',
      abstract: 'Abstract',
      keywords: 'one, two',
      mainSource: 'Source',
    },
    draftFileMetadata: null,
  }));
  const { view } = setupController({ storage });
  expect(view.element.querySelector('#title').value).toBe('Loaded draft');
});

test('ignores draft when data missing', () => {
  const storage = createMocks().storage;
  storage.loadDraft = jest.fn(() => ({ draftData: null, draftFileMetadata: null }));
  const { view } = setupController({ storage });
  expect(view.element.querySelector('#title').value).toBe('');
});

test('submit succeeds without onSubmitSuccess callback', () => {
  const { view } = setupController({ onSubmitSuccess: null });
  setValues(view);
  setFile(view, makeFile('paper.pdf', 1000, 'application/pdf'));
  submit(view);
  expect(view.element.querySelector('.status').textContent).toContain('Submission');
});
