const passwordFailures = [];

export const passwordErrorLogging = {
  logFailure(details) {
    passwordFailures.push({
      ...details,
      timestamp: new Date().toISOString(),
    });
  },
  getFailures() {
    return passwordFailures.slice();
  },
  clear() {
    passwordFailures.length = 0;
  },
};
