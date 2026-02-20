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

test('auth service recognizes admin and editor roles', () => {
  expect(authService.isAdminOrEditor({ role: 'Admin' })).toBe(true);
  expect(authService.isAdminOrEditor({ role: 'Editor' })).toBe(true);
  expect(authService.isAdminOrEditor({ roles: ['editor'] })).toBe(true);
  expect(authService.isAdminOrEditor({ email: 'admin@example.com' })).toBe(true);
  expect(authService.isAdminOrEditor({ role: 'Author' })).toBe(false);
  expect(authService.isAdminOrEditor()).toBe(false);
});
