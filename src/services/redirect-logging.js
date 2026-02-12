const redirectFailures = [];

export const redirectLogging = {
  logFailure(details) {
    redirectFailures.push({
      ...details,
      timestamp: new Date().toISOString(),
    });
  },
  getFailures() {
    return redirectFailures.slice();
  },
  clear() {
    redirectFailures.length = 0;
  },
};
