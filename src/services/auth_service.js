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
};
