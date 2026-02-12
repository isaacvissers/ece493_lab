const loginFailures = [];

export const loginLogging = {
  logFailure(details) {
    loginFailures.push({
      ...details,
      timestamp: new Date().toISOString(),
    });
  },
  getFailures() {
    return loginFailures.slice();
  },
  clear() {
    loginFailures.length = 0;
  },
};
