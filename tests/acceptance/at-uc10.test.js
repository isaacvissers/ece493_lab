import { createMetadataFormView } from '../../src/views/metadata-form-view.js';
import { createMetadataController } from '../../src/controllers/metadata-controller.js';
import { metadataStorage } from '../../src/services/metadata-storage.js';
import { metadataErrorLog } from '../../src/services/metadata-error-log.js';
import { sessionState } from '../../src/models/session-state.js';

function setupAcceptance() {
  const view = createMetadataFormView();
  document.body.appendChild(view.element);
  const controller = createMetadataController({
    view,
    storage: metadataStorage,
    sessionState,
    errorLogger: metadataErrorLog,
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

test('required metadata fields are visible', () => {
  sessionState.authenticate({ id: 'acct_1', email: 'author@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  expect(view.element.querySelector('#authorNames')).toBeTruthy();
  expect(view.element.querySelector('#affiliations')).toBeTruthy();
  expect(view.element.querySelector('#contactEmail')).toBeTruthy();
  expect(view.element.querySelector('#abstract')).toBeTruthy();
  expect(view.element.querySelector('#keywords')).toBeTruthy();
  expect(view.element.querySelector('#mainSource')).toBeTruthy();
});

test('valid metadata save persists values', () => {
  sessionState.authenticate({ id: 'acct_2', email: 'save@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  setValues(view, { contactEmail: 'save@example.com' });
  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  const saved = metadataStorage.loadMetadata('save@example.com');
  expect(saved).toBeTruthy();
  expect(saved.metadata.contactEmail).toBe('save@example.com');
});

test('draft save preserves partial metadata', () => {
  sessionState.authenticate({ id: 'acct_3', email: 'draft@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  setValues(view, { affiliations: '' });
  view.element.querySelector('#save-draft').click();
  const draft = metadataStorage.loadDraft('draft@example.com');
  expect(draft).toBeTruthy();
});

test('missing required field blocks final save', () => {
  sessionState.authenticate({ id: 'acct_4', email: 'missing@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  setValues(view, { authorNames: '' });
  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  expect(view.element.querySelector('#authorNames-error').textContent).toContain('required');
});

test('invalid contact email blocks save', () => {
  sessionState.authenticate({ id: 'acct_5', email: 'invalid@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  setValues(view, { contactEmail: 'bad' });
  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  expect(view.element.querySelector('#contactEmail-error').textContent).toContain('Email');
});

test('invalid keywords block save', () => {
  sessionState.authenticate({ id: 'acct_6', email: 'keys@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  setValues(view, { keywords: '' });
  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  expect(view.element.querySelector('#keywords-error').textContent).toContain('required');
});

test('storage failure shows error and logs failure', () => {
  sessionState.authenticate({ id: 'acct_7', email: 'fail@example.com', createdAt: new Date().toISOString() });
  metadataStorage.setFailureMode(true);
  const { view } = setupAcceptance();
  setValues(view, { contactEmail: 'fail@example.com' });
  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  expect(view.element.querySelector('.status').textContent).toContain('unavailable');
  expect(metadataErrorLog.getFailures().length).toBe(1);
  metadataStorage.setFailureMode(false);
});

test('draft save rejects invalid contact and keywords', () => {
  sessionState.authenticate({ id: 'acct_8', email: 'draft2@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  setValues(view, { contactEmail: 'bad', keywords: 'alpha; beta' });
  view.element.querySelector('#save-draft').click();
  expect(view.element.querySelector('#contactEmail-error').textContent).toContain('Email');
  expect(view.element.querySelector('#keywords-error').textContent).toContain('Keywords');
});
