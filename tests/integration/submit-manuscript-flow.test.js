import { createSubmitManuscriptView } from '../../src/views/submit-manuscript-view.js';
import { createManuscriptSubmissionController } from '../../src/controllers/manuscript-submission-controller.js';
import { submissionStorage } from '../../src/services/submission-storage.js';
import { submissionErrorLog } from '../../src/services/submission-error-log.js';
import { sessionState } from '../../src/models/session-state.js';

function setupIntegration() {
  const view = createSubmitManuscriptView();
  document.body.appendChild(view.element);
  const controller = createManuscriptSubmissionController({
    view,
    storage: submissionStorage,
    sessionState,
    errorLogger: submissionErrorLog,
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

test('successful submission persists manuscript', () => {
  submissionStorage.reset();
  sessionState.authenticate({ id: 'acct_1', email: 'author@example.com', createdAt: new Date().toISOString() });
  const { view } = setupIntegration();
  setValues(view);
  const file = makeFile('paper.pdf', 1024, 'application/pdf');
  const start = performance.now();
  submit(view, file);
  const durationMs = performance.now() - start;
  const manuscripts = submissionStorage.getManuscripts();
  expect(manuscripts.length).toBe(1);
  expect(manuscripts[0].title).toBe('Paper title');
  expect(manuscripts[0].submittedBy).toBe('author@example.com');
  expect(durationMs).toBeLessThan(200);
});

test('draft can be saved and reopened', () => {
  submissionStorage.reset();
  sessionState.authenticate({ id: 'acct_2', email: 'draft@example.com', createdAt: new Date().toISOString() });
  const { view } = setupIntegration();
  setValues(view, { title: 'Draft title', contactEmail: 'draft@example.com' });
  view.element.querySelector('#save-draft').click();
  const storedDraft = submissionStorage.loadDraft('draft@example.com');
  expect(storedDraft).toBeTruthy();

  const secondView = createSubmitManuscriptView();
  document.body.appendChild(secondView.element);
  const controller = createManuscriptSubmissionController({
    view: secondView,
    storage: submissionStorage,
    sessionState,
    errorLogger: submissionErrorLog,
    onSubmitSuccess: () => {},
  });
  controller.init();
  expect(secondView.element.querySelector('#title').value).toBe('Draft title');
});
