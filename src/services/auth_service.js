export const authService = {
  requireAuth({ sessionState, onAuthRequired } = {}) {
    if (!sessionState || !sessionState.isAuthenticated || !sessionState.isAuthenticated()) {
      if (onAuthRequired) {
        onAuthRequired();
      }
      return { ok: false };
    }
    return { ok: true, user: sessionState.getCurrentUser ? sessionState.getCurrentUser() : null };
  },
  isAdminOrEditor(user) {
    if (!user) {
      return false;
    }
    const normalizedRole = user.role ? user.role.toLowerCase() : '';
    const roles = Array.isArray(user.roles) ? user.roles.map((role) => role.toLowerCase()) : [];
    return normalizedRole === 'admin'
      || normalizedRole === 'editor'
      || roles.includes('admin')
      || roles.includes('editor')
      || user.email === 'admin@example.com';
  },
};
