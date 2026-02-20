import { authService } from '../../src/services/auth_service.js';

test('auth service blocks unauthenticated access', () => {
  let prompted = false;
  const result = authService.requireAuth({
    sessionState: { isAuthenticated: () => false },
    onAuthRequired: () => {
      prompted = true;
    },
  });
  expect(result.ok).toBe(false);
  expect(prompted).toBe(true);
});

test('auth service returns user when authenticated', () => {
  const result = authService.requireAuth({
    sessionState: {
      isAuthenticated: () => true,
      getCurrentUser: () => ({ id: 'user_1' }),
    },
  });
  expect(result.ok).toBe(true);
  expect(result.user.id).toBe('user_1');
});
