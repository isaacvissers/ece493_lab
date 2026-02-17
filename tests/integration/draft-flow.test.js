import { jest } from '@jest/globals';
import { createSubmitManuscriptView } from '../../src/views/submit-manuscript-view.js';
import { createManuscriptSubmissionController } from '../../src/controllers/manuscript-submission-controller.js';
import { draftStorage } from '../../src/services/draft-storage.js';
import { draftErrorLog } from '../../src/services/draft-error-log.js';
import { submissionStorage } from '../../src/services/submission-storage.js';
import { submissionErrorLog } from '../../src/services/submission-error-log.js';
import { sessionState } from '../../src/models/session-state.js';

function setupIntegration(overrides = {}) {
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
    mainSource: 'Main source',
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

test('draft save and reload restores values and attachment indicator', () => {
  sessionState.authenticate({ id: 'acct_1', email: 'author@example.com', createdAt: new Date().toISOString() });
  const { view } = setupIntegration();
  setValues(view, { title: 'Draft title' });
  const file = makeFile('draft.pdf', 1024, 'application/pdf');
  setFile(view, file);
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
  expect(secondView.element.querySelector('#title').value).toBe('Draft title');
  expect(secondView.element.querySelector('#draft-attachment-status').textContent).toContain('draft.pdf');
});

test('session-expired draft save triggers auth callback', () => {
  const onAuthRequired = jest.fn();
  const { view } = setupIntegration({ onAuthRequired });
  setValues(view, { title: 'Draft title' });
  view.element.querySelector('#save-draft').click();
  expect(onAuthRequired).toHaveBeenCalled();
});
