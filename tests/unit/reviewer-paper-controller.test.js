import { jest } from '@jest/globals';
import { createReviewerPaperController } from '../../src/controllers/reviewer-paper-controller.js';

test('requests login when unauthenticated', () => {
  const view = { setStatus: jest.fn(), setPaper: jest.fn() };
  const sessionState = { isAuthenticated: () => false, getCurrentUser: () => null };
  const authController = { requestLogin: jest.fn() };

  const controller = createReviewerPaperController({
    view,
    sessionState,
    paperId: 'paper_1',
    authController,
  });

  controller.init();
  expect(view.setStatus).toHaveBeenCalledWith('Please log in to view the paper.', true);
  expect(authController.requestLogin).toHaveBeenCalledWith({
    destination: 'reviewer-paper',
    payload: { paperId: 'paper_1' },
  });
});

test('uses provided reviewerEmail and handles unavailable', () => {
  const view = { setStatus: jest.fn(), setPaper: jest.fn() };
  const sessionState = { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'ignored@example.com' }) };
  const paperAccess = {
    getPaperDetails: jest.fn(() => ({ ok: false, reason: 'unavailable' })),
  };

  const controller = createReviewerPaperController({
    view,
    sessionState,
    reviewerEmail: 'override@example.com',
    paperId: 'paper_2',
    paperAccess,
  });

  controller.init();
  expect(paperAccess.getPaperDetails).toHaveBeenCalledWith({
    reviewerEmail: 'override@example.com',
    paperId: 'paper_2',
    errorLog: expect.anything(),
  });
  expect(view.setStatus).toHaveBeenCalledWith('This paper or manuscript is unavailable.', true);
});

test('falls back to retrieval message for unknown errors', () => {
  const view = { setStatus: jest.fn(), setPaper: jest.fn() };
  const sessionState = { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'reviewer@example.com' }) };
  const paperAccess = {
    getPaperDetails: jest.fn(() => ({ ok: false, reason: 'retrieval_failed' })),
  };

  const controller = createReviewerPaperController({
    view,
    sessionState,
    paperId: 'paper_3',
    paperAccess,
  });

  controller.init();
  expect(view.setStatus).toHaveBeenCalledWith('Paper details could not be loaded. Please try again.', true);
});

test('denies access when assignment not accepted', () => {
  const view = { setStatus: jest.fn(), setPaper: jest.fn() };
  const sessionState = { isAuthenticated: () => true, getCurrentUser: () => ({ email: 'reviewer@example.com' }) };
  const paperAccess = {
    getPaperDetails: jest.fn(() => ({ ok: false, reason: 'not_accepted' })),
  };

  const controller = createReviewerPaperController({
    view,
    sessionState,
    paperId: 'paper_4',
    paperAccess,
  });

  controller.init();
  expect(view.setStatus).toHaveBeenCalledWith(
    'Access denied. You must accept the assignment to view this paper.',
    true,
  );
});

test('unauthenticated flow skips authController when missing', () => {
  const view = { setStatus: jest.fn(), setPaper: jest.fn() };
  const sessionState = { isAuthenticated: () => false, getCurrentUser: () => null };

  const controller = createReviewerPaperController({
    view,
    sessionState,
    paperId: 'paper_5',
    authController: null,
  });

  controller.init();
  expect(view.setStatus).toHaveBeenCalledWith('Please log in to view the paper.', true);
});

test('supports default parameter object', () => {
  const controller = createReviewerPaperController();
  expect(controller).toEqual(expect.any(Object));
});

test('uses null reviewer email when session user lacks email', () => {
  const view = { setStatus: jest.fn(), setPaper: jest.fn() };
  const sessionState = { isAuthenticated: () => true, getCurrentUser: () => ({ id: 'acct_1' }) };
  const paperAccess = { getPaperDetails: jest.fn(() => ({ ok: true, paper: {}, manuscript: {} })) };

  const controller = createReviewerPaperController({
    view,
    sessionState,
    paperId: 'paper_9',
    paperAccess,
  });

  controller.init();
  expect(paperAccess.getPaperDetails).toHaveBeenCalledWith({
    reviewerEmail: null,
    paperId: 'paper_9',
    errorLog: expect.anything(),
  });
});
