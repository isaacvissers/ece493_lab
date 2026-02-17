import { createSubmissionFormView } from '../../src/views/submission-form-view.js';
import { createSubmissionValidationController } from '../../src/controllers/submission-validation-controller.js';
import { sessionState } from '../../src/models/session-state.js';
import { setInputFiles, makeFile } from '../test-helpers.js';

function setupIntegration() {
  const view = createSubmissionFormView();
  document.body.appendChild(view.element);
  const controller = createSubmissionValidationController({
    view,
    sessionState,
    onSubmitSuccess: () => {},
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
  sessionState.authenticate({ id: 'acct_perf', email: 'perf@example.com', createdAt: new Date().toISOString() });
  const { view } = setupIntegration();
  setValues(view);
  setInputFiles(view.element.querySelector('#manuscriptFile'), [makeFile('paper.pdf')]);
  const start = performance.now();
  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  const duration = performance.now() - start;
  expect(duration).toBeLessThan(200);
});
