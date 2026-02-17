import { createSubmitManuscriptView } from '../../src/views/submit-manuscript-view.js';
import { createManuscriptSubmissionController } from '../../src/controllers/manuscript-submission-controller.js';
import { submissionStorage } from '../../src/services/submission-storage.js';
import { submissionErrorLog } from '../../src/services/submission-error-log.js';
import { draftStorage } from '../../src/services/draft-storage.js';
import { draftErrorLog } from '../../src/services/draft-error-log.js';
import { sessionState } from '../../src/models/session-state.js';

function setupAcceptance() {
  const view = createSubmitManuscriptView();
  document.body.appendChild(view.element);
  const controller = createManuscriptSubmissionController({
    view,
    storage: submissionStorage,
    draftStorage,
    sessionState,
    errorLogger: submissionErrorLog,
    draftErrorLogger: draftErrorLog,
    onSubmitSuccess: () => {},
  });
  controller.init();
  return { view, controller };
}

function setValues(view, overrides = {}) {
  const values = {
    title: 'Paper title',
    authorNames: 'Author One',
    affiliations: 'Institute',
    contactEmail: 'author@example.com',
    abstract: 'Abstract',
    keywords: 'paper, test',
    mainSource: 'Main source',
    ...overrides,
  };
  view.setValues(values);
}

function submit(view, file) {
  const input = view.element.querySelector('#manuscriptFile');
  Object.defineProperty(input, 'files', {
    value: [file],
    writable: false,
  });
  const event = new Event('submit', { bubbles: true, cancelable: true });
  view.element.querySelector('form').dispatchEvent(event);
}

function makeFile(name, size, type) {
  return new File(['content'], name, { type, lastModified: Date.now(), size });
}

function resetEnvironment() {
  submissionStorage.reset();
  submissionErrorLog.clear();
  draftStorage.reset();
  draftErrorLog.clear();
  sessionState.clear();
  document.body.innerHTML = '';
}

beforeEach(() => {
  resetEnvironment();
});

test('unauthenticated access is blocked', () => {
  const { controller, view } = setupAcceptance();
  expect(controller.requireAuth()).toBe(false);
  expect(view.element.querySelector('.status').textContent).toContain('log in');
});

test('invalid file type is rejected', () => {
  sessionState.authenticate({ id: 'acct_1', email: 'author@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  setValues(view);
  const file = makeFile('paper.exe', 1024, 'application/octet-stream');
  submit(view, file);
  expect(view.element.querySelector('#manuscriptFile-error').textContent).toContain('PDF');
});

test('storage failure shows submission unavailable', () => {
  submissionStorage.setFailureMode(true);
  sessionState.authenticate({ id: 'acct_2', email: 'author2@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  setValues(view, { contactEmail: 'author2@example.com' });
  const file = makeFile('paper.pdf', 1024, 'application/pdf');
  submit(view, file);
  expect(view.element.querySelector('.status').textContent).toContain('unavailable');
  expect(submissionErrorLog.getFailures().length).toBe(1);
  submissionStorage.setFailureMode(false);
});

test('successful submission shows confirmation message', () => {
  sessionState.authenticate({ id: 'acct_3', email: 'author3@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  setValues(view, { contactEmail: 'author3@example.com' });
  const file = makeFile('paper.pdf', 1024, 'application/pdf');
  submit(view, file);
  expect(view.element.querySelector('.status').textContent).toContain('Submission received');
});

test('missing required field shows field error', () => {
  sessionState.authenticate({ id: 'acct_4', email: 'author4@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  setValues(view, { title: '' });
  const file = makeFile('paper.pdf', 1024, 'application/pdf');
  submit(view, file);
  expect(view.element.querySelector('#title-error').textContent).toContain('required');
});

test('invalid email format shows error message', () => {
  sessionState.authenticate({ id: 'acct_5', email: 'author5@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  setValues(view, { contactEmail: 'invalid-email' });
  const file = makeFile('paper.pdf', 1024, 'application/pdf');
  submit(view, file);
  expect(view.element.querySelector('#contactEmail-error').textContent).toContain('Email format is invalid');
});

test('oversize file is rejected', () => {
  sessionState.authenticate({ id: 'acct_6', email: 'author6@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  setValues(view);
  const file = new File([new Uint8Array(7 * 1024 * 1024 + 1)], 'paper.pdf', { type: 'application/pdf' });
  submit(view, file);
  expect(view.element.querySelector('#manuscriptFile-error').textContent).toContain('size limit');
});

test('upload failure shows retry message', () => {
  sessionState.authenticate({ id: 'acct_7', email: 'author7@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  setValues(view);
  const file = makeFile('paper.pdf', 1024, 'application/pdf');
  file.failUpload = true;
  submit(view, file);
  expect(view.element.querySelector('#manuscriptFile-error').textContent).toContain('Upload failed');
});

test('save draft stores data and shows confirmation', () => {
  sessionState.authenticate({ id: 'acct_8', email: 'draft@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  setValues(view, { title: 'Draft title', contactEmail: 'draft@example.com' });
  view.element.querySelector('#save-draft').click();
  const storedDraft = draftStorage.loadDraft('draft@example.com');
  expect(storedDraft).toBeTruthy();
  expect(view.element.querySelector('.status').textContent).toContain('Draft saved');
});

test('saved draft loads on init', () => {
  sessionState.authenticate({ id: 'acct_9', email: 'restore@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  setValues(view, { title: 'Restored title', contactEmail: 'restore@example.com' });
  view.element.querySelector('#save-draft').click();

  document.body.innerHTML = '';
  const secondView = createSubmitManuscriptView();
  document.body.appendChild(secondView.element);
  const controller = createManuscriptSubmissionController({
    view: secondView,
    storage: submissionStorage,
    draftStorage,
    sessionState,
    errorLogger: submissionErrorLog,
    draftErrorLogger: draftErrorLog,
    onSubmitSuccess: () => {},
  });
  controller.init();
  expect(secondView.element.querySelector('#title').value).toBe('Restored title');
  expect(secondView.element.querySelector('.status').textContent).toContain('We loaded your saved draft.');
});
