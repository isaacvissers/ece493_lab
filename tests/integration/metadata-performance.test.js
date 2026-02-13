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

function setValues(view) {
  view.setValues({
    authorNames: 'Author One',
    affiliations: 'Institute',
    contactEmail: 'author@example.com',
    abstract: 'Abstract',
    keywords: 'alpha, beta',
    mainSource: 'file upload',
  });
}

test('validation feedback responds within 200 ms', () => {
  metadataStorage.reset();
  sessionState.authenticate({ id: 'acct_perf', email: 'perf@example.com', createdAt: new Date().toISOString() });
  const { view } = setupIntegration();
  setValues(view);
  const start = performance.now();
  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  const duration = performance.now() - start;
  expect(duration).toBeLessThan(200);
});
