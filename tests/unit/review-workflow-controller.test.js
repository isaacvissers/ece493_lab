import { jest } from '@jest/globals';
import { createReviewWorkflowController } from '../../src/controllers/review-workflow-controller.js';

function createViewStub() {
  let handler = null;
  return {
    setStatus: jest.fn(),
    setPaper: jest.fn(),
    onStartReview: (fn) => { handler = fn; },
    triggerStart() {
      handler();
    },
  };
}

test('init reports missing paper', () => {
  const view = createViewStub();
  const controller = createReviewWorkflowController({
    view,
    readinessController: { evaluateReadiness: jest.fn() },
    assignmentStorage: { getPaper: jest.fn(() => null) },
    paperId: 'missing',
  });

  controller.init();
  expect(view.setStatus).toHaveBeenCalledWith('Paper not found.', true);
});

test('handles start review update failures', () => {
  const view = createViewStub();
  const readinessController = { evaluateReadiness: jest.fn(() => ({ ok: true, ready: true })) };
  const controller = createReviewWorkflowController({
    view,
    readinessController,
    assignmentStorage: {
      getPaper: jest.fn(() => ({ id: 'paper_1', title: 'Paper' })),
      updatePaperStatus: jest.fn(() => {
        throw new Error('update_failed');
      }),
    },
    paperId: 'paper_1',
  });

  controller.init();
  view.triggerStart();
  expect(view.setStatus).toHaveBeenCalledWith('Review could not be started. Please try again.', true);
});

test('creates controller with default arguments', () => {
  const controller = createReviewWorkflowController();
  expect(typeof controller.init).toBe('function');
});
