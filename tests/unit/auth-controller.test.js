import { authController } from '../../src/controllers/auth-controller.js';

beforeEach(() => {
  authController.clearPending();
});

test('requestLogin stores destination and payload', () => {
  authController.requestLogin({ destination: 'reviewer-assignments', payload: { paperId: 'paper_1' } });
  expect(authController.getPending()).toEqual({
    destination: 'reviewer-assignments',
    payload: { paperId: 'paper_1' },
  });
});

test('requestLogin handles missing args', () => {
  authController.requestLogin();
  expect(authController.getPending()).toEqual({ destination: undefined, payload: undefined });
});
