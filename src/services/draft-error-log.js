const draftFailures = [];

export const draftErrorLog = {
  logFailure(details) {
    draftFailures.push({
      ...details,
      timestamp: new Date().toISOString(),
    });
  },
  getFailures() {
    return draftFailures.slice();
  },
  clear() {
    draftFailures.length = 0;
  },
};
