let pendingDestination = null;

export const authController = {
  requestLogin({ destination, payload } = {}) {
    pendingDestination = { destination, payload };
  },
  getPending() {
    return pendingDestination;
  },
  clearPending() {
    pendingDestination = null;
  },
};
