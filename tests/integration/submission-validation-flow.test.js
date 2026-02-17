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

test('validation flow accepts valid submission', () => {
  sessionState.authenticate({ id: 'acct_10', email: 'author@example.com', createdAt: new Date().toISOString() });
  const { view } = setupIntegration();
  setValues(view);
  setInputFiles(view.element.querySelector('#manuscriptFile'), [makeFile('paper.pdf')]);
  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  expect(view.element.querySelector('.status').textContent).toContain('passed validation');
});

test('draft save uses permissive validation', () => {
  sessionState.authenticate({ id: 'acct_11', email: 'draft@example.com', createdAt: new Date().toISOString() });
  const { view } = setupIntegration();
  setValues(view, { affiliations: '' });
  view.element.querySelector('#save-draft').click();
  expect(view.element.querySelector('.status').textContent).toContain('draft');
});
