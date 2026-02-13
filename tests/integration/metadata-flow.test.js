import { createMetadataFormView } from '../../src/views/metadata-form-view.js';
import { createMetadataController } from '../../src/controllers/metadata-controller.js';
import { metadataStorage } from '../../src/services/metadata-storage.js';
import { metadataErrorLog } from '../../src/services/metadata-error-log.js';
import { sessionState } from '../../src/models/session-state.js';

function setupIntegration() {
  const view = createMetadataFormView();
  document.body.appendChild(view.element);
  const controller = createMetadataController({
    view,
    storage: metadataStorage,
    sessionState,
    errorLogger: metadataErrorLog,
  });
  controller.init();
  return { view };
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

test('metadata save persists and reloads', () => {
  metadataStorage.reset();
  sessionState.authenticate({ id: 'acct_10', email: 'meta@example.com', createdAt: new Date().toISOString() });
  const { view } = setupIntegration();
  setValues(view, { contactEmail: 'meta@example.com' });
  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  const saved = metadataStorage.loadMetadata('meta@example.com');
  expect(saved).toBeTruthy();

  document.body.innerHTML = '';
  const secondView = createMetadataFormView();
  document.body.appendChild(secondView.element);
  const controller = createMetadataController({
    view: secondView,
    storage: metadataStorage,
    sessionState,
    errorLogger: metadataErrorLog,
  });
  controller.init();
  expect(secondView.element.querySelector('#contactEmail').value).toBe('meta@example.com');
});

test('draft can be saved and reopened', () => {
  metadataStorage.reset();
  sessionState.authenticate({ id: 'acct_11', email: 'draft@example.com', createdAt: new Date().toISOString() });
  const { view } = setupIntegration();
  setValues(view, { affiliations: '' });
  view.element.querySelector('#save-draft').click();
  const draft = metadataStorage.loadDraft('draft@example.com');
  expect(draft).toBeTruthy();

  document.body.innerHTML = '';
  const secondView = createMetadataFormView();
  document.body.appendChild(secondView.element);
  const controller = createMetadataController({
    view: secondView,
    storage: metadataStorage,
    sessionState,
    errorLogger: metadataErrorLog,
  });
  controller.init();
  expect(secondView.element.querySelector('#authorNames').value).toBe('Author One');
});
