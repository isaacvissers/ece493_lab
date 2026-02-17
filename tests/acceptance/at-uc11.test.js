import { createSubmissionFormView } from '../../src/views/submission-form-view.js';
import { createSubmissionValidationController } from '../../src/controllers/submission-validation-controller.js';
import { sessionState } from '../../src/models/session-state.js';
import { setInputFiles, makeFile } from '../test-helpers.js';

function setupAcceptance() {
  const view = createSubmissionFormView();
  document.body.appendChild(view.element);
  const controller = createSubmissionValidationController({
    view,
    sessionState,
    onSubmitSuccess: () => {},
  });
  controller.init();
  return { view, controller };
}

function setValues(view, overrides = {}) {
  const values = {
    authorNames: 'Author One',
    affiliations: 'Institute',
    contactEmail: 'author@example.com',
    abstract: 'Abstract',
    keywords: 'alpha, beta',
    mainSource: 'file upload',
    ...overrides,
  };
  view.setValues(values);
}

function submit(view) {
  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}

test('valid submission passes validation', () => {
  sessionState.authenticate({ id: 'acct_1', email: 'author@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  setValues(view);
  setInputFiles(view.element.querySelector('#manuscriptFile'), [makeFile('paper.pdf')]);
  submit(view);
  expect(view.element.querySelector('.status').textContent).toContain('passed validation');
});

test('missing required field shows error', () => {
  sessionState.authenticate({ id: 'acct_2', email: 'author2@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  setValues(view, { affiliations: '' });
  setInputFiles(view.element.querySelector('#manuscriptFile'), [makeFile('paper.pdf')]);
  submit(view);
  expect(view.element.querySelector('#affiliations-error').textContent).toContain('required');
});

test('invalid email blocks submission', () => {
  sessionState.authenticate({ id: 'acct_3', email: 'author3@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  setValues(view, { contactEmail: 'invalid' });
  setInputFiles(view.element.querySelector('#manuscriptFile'), [makeFile('paper.pdf')]);
  submit(view);
  expect(view.element.querySelector('#contactEmail-error').textContent).toContain('Email');
});

test('missing file blocks submission', () => {
  sessionState.authenticate({ id: 'acct_4', email: 'author4@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  setValues(view);
  submit(view);
  expect(view.element.querySelector('#manuscriptFile-error').textContent).toContain('required');
});

test('invalid file type shows accepted formats', () => {
  sessionState.authenticate({ id: 'acct_5', email: 'author5@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  setValues(view);
  setInputFiles(view.element.querySelector('#manuscriptFile'), [makeFile('paper.exe')]);
  submit(view);
  expect(view.element.querySelector('#manuscriptFile-error').textContent).toContain('Accepted formats');
});

test('multiple errors are shown together', () => {
  sessionState.authenticate({ id: 'acct_6', email: 'author6@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  setValues(view, { abstract: '', contactEmail: 'bad' });
  setInputFiles(view.element.querySelector('#manuscriptFile'), [makeFile('paper.exe')]);
  submit(view);
  expect(view.element.querySelector('#abstract-error').textContent).toContain('required');
  expect(view.element.querySelector('#contactEmail-error').textContent).toContain('Email');
  expect(view.element.querySelector('#manuscriptFile-error').textContent).toContain('Accepted formats');
});

test('draft save allows missing required fields', () => {
  sessionState.authenticate({ id: 'acct_7', email: 'author7@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  setValues(view, { affiliations: '' });
  view.element.querySelector('#save-draft').click();
  expect(view.element.querySelector('.status').textContent).toContain('draft');
});

test('draft save rejects invalid formats', () => {
  sessionState.authenticate({ id: 'acct_8', email: 'author8@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  setValues(view, { contactEmail: 'bad' });
  setInputFiles(view.element.querySelector('#manuscriptFile'), [makeFile('paper.exe')]);
  view.element.querySelector('#save-draft').click();
  expect(view.element.querySelector('#contactEmail-error').textContent).toContain('Email');
  expect(view.element.querySelector('#manuscriptFile-error').textContent).toContain('Accepted formats');
});
