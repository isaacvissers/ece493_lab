import { jest } from '@jest/globals';
import { createReviewerAssignmentsController } from '../../src/controllers/reviewer-assignments-controller.js';

test('open handler forwards assignment to onOpenPaper', () => {
  const openSpy = jest.fn();
  let openHandler = null;
  const view = {
    setStatus: jest.fn(),
    setAssignments: jest.fn(),
    onRefresh: jest.fn(),
    onOpen: (handler) => {
      openHandler = handler;
    },
  };
  const sessionState = {
    isAuthenticated: () => true,
    getCurrentUser: () => ({ email: 'reviewer@example.com' }),
  };
  const reviewerAssignments = {
    listAcceptedAssignments: () => ({ ok: true, assignments: [{ paperId: 'paper_1' }] }),
  };

  const controller = createReviewerAssignmentsController({
    view,
    sessionState,
    reviewerAssignments,
    onOpenPaper: openSpy,
  });

  controller.init();
  openHandler({ paperId: 'paper_1' });
  expect(openSpy).toHaveBeenCalledWith({ paperId: 'paper_1' });
});

test('skips open handler when onOpenPaper missing and handles unauthenticated state', () => {
  let openHandler = null;
  const view = {
    setStatus: jest.fn(),
    setAssignments: jest.fn(),
    onRefresh: jest.fn(),
    onOpen: (handler) => {
      openHandler = handler;
    },
  };
  const sessionState = {
    isAuthenticated: () => false,
    getCurrentUser: () => null,
  };

  const controller = createReviewerAssignmentsController({
    view,
    sessionState,
  });

  controller.init();
  openHandler({ paperId: 'paper_2' });
  expect(view.setStatus).toHaveBeenCalledWith('Please log in to view your assigned papers.', true);
});

test('handles missing reviewer email when authenticated', () => {
  const view = {
    setStatus: jest.fn(),
    setAssignments: jest.fn(),
    onRefresh: jest.fn(),
    onOpen: jest.fn(),
  };
  const sessionState = {
    isAuthenticated: () => true,
    getCurrentUser: () => ({ id: 'acct_1' }),
  };
  const reviewerAssignments = {
    listAcceptedAssignments: jest.fn(() => ({ ok: true, assignments: [] })),
  };

  const controller = createReviewerAssignmentsController({
    view,
    sessionState,
    reviewerAssignments,
  });

  controller.init();
  expect(reviewerAssignments.listAcceptedAssignments).toHaveBeenCalledWith({
    reviewerEmail: null,
    errorLog: expect.anything(),
  });
});

test('requests login when unauthenticated and authController present', () => {
  const view = {
    setStatus: jest.fn(),
    setAssignments: jest.fn(),
    onRefresh: jest.fn(),
    onOpen: jest.fn(),
  };
  const sessionState = {
    isAuthenticated: () => false,
    getCurrentUser: () => null,
  };
  const authController = { requestLogin: jest.fn() };

  const controller = createReviewerAssignmentsController({
    view,
    sessionState,
    authController,
  });

  controller.init();
  expect(authController.requestLogin).toHaveBeenCalledWith({ destination: 'reviewer-assignments' });
});

test('supports default parameter object', () => {
  const controller = createReviewerAssignmentsController();
  expect(controller).toEqual(expect.any(Object));
});

test('unauthenticated flow skips authController when null', () => {
  const view = {
    setStatus: jest.fn(),
    setAssignments: jest.fn(),
    onRefresh: jest.fn(),
    onOpen: jest.fn(),
  };
  const sessionState = {
    isAuthenticated: () => false,
    getCurrentUser: () => null,
  };

  const controller = createReviewerAssignmentsController({
    view,
    sessionState,
    authController: null,
  });

  controller.init();
  expect(view.setStatus).toHaveBeenCalledWith('Please log in to view your assigned papers.', true);
});
