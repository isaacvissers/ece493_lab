import { createSubmitManuscriptView } from '../../src/views/submit-manuscript-view.js';
import { createManuscriptSubmissionController } from '../../src/controllers/manuscript-submission-controller.js';
import { draftStorage } from '../../src/services/draft-storage.js';
import { draftErrorLog } from '../../src/services/draft-error-log.js';
import { submissionStorage } from '../../src/services/submission-storage.js';
import { submissionErrorLog } from '../../src/services/submission-error-log.js';
import { sessionState } from '../../src/models/session-state.js';

function setupAcceptance(overrides = {}) {
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
    onAuthRequired: overrides.onAuthRequired,
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
    mainSource: 'file upload',
    ...overrides,
  };
  view.setValues(values);
}

function setFile(view, file) {
  const input = view.element.querySelector('#manuscriptFile');
  Object.defineProperty(input, 'files', {
    value: file ? [file] : [],
    writable: false,
  });
}

function makeFile(name, size, type) {
  return new File(['content'], name, { type, lastModified: Date.now(), size });
}

beforeEach(() => {
  draftStorage.reset();
  draftErrorLog.clear();
  submissionStorage.reset();
  submissionErrorLog.clear();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('draft saves with incomplete fields and warns without blocking', () => {
  sessionState.authenticate({ id: 'acct_1', email: 'author@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  setValues(view, { title: '', contactEmail: '' });
  view.element.querySelector('#save-draft').click();
  const storedDraft = draftStorage.loadDraft('author@example.com');
  expect(storedDraft).toBeTruthy();
  expect(view.element.querySelector('.status').textContent).toContain('Draft saved');
  expect(view.element.querySelector('#draft-warning').textContent).toContain('incomplete');
});

test('draft overwrite keeps latest changes', () => {
  sessionState.authenticate({ id: 'acct_2', email: 'author2@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  setValues(view, { title: 'First title', contactEmail: 'author2@example.com' });
  view.element.querySelector('#save-draft').click();
  setValues(view, { title: 'Latest title', contactEmail: 'author2@example.com' });
  view.element.querySelector('#save-draft').click();
  const storedDraft = draftStorage.loadDraft('author2@example.com');
  expect(storedDraft.draftData.title).toBe('Latest title');
});

test('draft save preserves attachment reference', () => {
  sessionState.authenticate({ id: 'acct_3', email: 'author3@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  setValues(view, { contactEmail: 'author3@example.com' });
  setFile(view, makeFile('draft.pdf', 2048, 'application/pdf'));
  view.element.querySelector('#save-draft').click();
  const storedDraft = draftStorage.loadDraft('author3@example.com');
  expect(storedDraft.draftFileMetadata.originalName).toBe('draft.pdf');
});

test('draft save failure shows error and logs failure', () => {
  sessionState.authenticate({ id: 'acct_4', email: 'author4@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  setValues(view, { title: 'Draft title', contactEmail: 'author4@example.com' });
  view.element.querySelector('#save-draft').click();
  draftStorage.setSaveFailureMode(true);
  setValues(view, { title: 'Second title', contactEmail: 'author4@example.com' });
  view.element.querySelector('#save-draft').click();
  const storedDraft = draftStorage.loadDraft('author4@example.com');
  expect(storedDraft.draftData.title).toBe('Draft title');
  expect(view.element.querySelector('.status').textContent).toContain('unavailable');
  expect(draftErrorLog.getFailures().length).toBe(1);
  draftStorage.setSaveFailureMode(false);
});

test('draft load failure blocks editing', () => {
  sessionState.authenticate({ id: 'acct_5', email: 'author5@example.com', createdAt: new Date().toISOString() });
  draftStorage.setLoadFailureMode(true);
  const { view } = setupAcceptance();
  expect(view.element.querySelector('.status').textContent).toContain('unavailable');
  expect(view.element.querySelector('#title').disabled).toBe(true);
  draftStorage.setLoadFailureMode(false);
});
