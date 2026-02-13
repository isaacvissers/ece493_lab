import { jest } from '@jest/globals';

jest.unstable_mockModule('../../src/models/manuscript.js', () => ({
  validateManuscript: () => ({ ok: false, errors: { affiliations: 'invalid_format' }, values: {} }),
  createManuscript: () => ({ id: 'ms_1' }),
}));

const { createSubmitManuscriptView } = await import('../../src/views/submit-manuscript-view.js');
const { createManuscriptSubmissionController } = await import('../../src/controllers/manuscript-submission-controller.js');

test('unknown invalid field does not set specific error', () => {
  const view = createSubmitManuscriptView();
  document.body.appendChild(view.element);
  const controller = createManuscriptSubmissionController({
    view,
    storage: { loadDraft: () => null, saveDraft: () => {}, saveSubmission: () => {}, clearDraft: () => {} },
    sessionState: { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'author@example.com' }) },
    errorLogger: { logFailure: () => {} },
    onSubmitSuccess: null,
  });
  controller.init();
  const event = new Event('submit', { bubbles: true, cancelable: true });
  view.element.querySelector('form').dispatchEvent(event);
  expect(view.element.querySelector('#affiliations-error').textContent).toBe('');
});
