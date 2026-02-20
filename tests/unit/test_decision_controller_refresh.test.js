import { jest } from '@jest/globals';
import { createDecisionController } from '../../src/controllers/decision_controller.js';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

test('decision controller refreshes pending decisions', () => {
  const repo = {
    listDecisionsForAuthor: jest.fn(() => []),
    getDecisionForAuthor: jest.fn()
      .mockReturnValueOnce({ ok: false, reason: 'pending', paper: { decisionReleaseAt: 'soon' } })
      .mockReturnValueOnce({ ok: true, paper: { title: 'Paper' }, decision: { value: 'accept' } }),
  };
  const detailView = {
    setPending: jest.fn(),
    setStatus: jest.fn(),
    setDecision: jest.fn(),
  };
  const sessionState = {
    isAuthenticated: () => true,
    getCurrentUser: () => ({ id: 'author_1' }),
  };

  const controller = createDecisionController({
    detailView,
    decisionRepository: repo,
    sessionState,
  });

  controller.showDecision('paper_1');
  jest.advanceTimersByTime(60000);

  expect(repo.getDecisionForAuthor).toHaveBeenCalledTimes(2);
  expect(detailView.setDecision).toHaveBeenCalled();
});
