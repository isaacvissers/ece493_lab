import { jest } from '@jest/globals';

jest.unstable_mockModule('../../src/models/manuscript.js', () => ({
  validateManuscript: () => ({ ok: false, errors: { keywords: 'invalid_keywords' }, values: {} }),
  createManuscript: () => ({ id: 'ms_1' }),
}));

const { createSubmitManuscriptView } = await import('../../src/views/submit-manuscript-view.js');
const { createManuscriptSubmissionController } = await import('../../src/controllers/manuscript-submission-controller.js');
const { UI_MESSAGES } = await import('../../src/services/ui-messages.js');

test('keywords validation path sets field error', () => {
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
  expect(view.element.querySelector('#keywords-error').textContent)
    .toContain(UI_MESSAGES.errors.keywordsInvalid.message);
});
