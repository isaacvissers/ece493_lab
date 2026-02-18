const violationFailures = [];

export const violationLog = {
  logFailure(details) {
    violationFailures.push({
      ...details,
      timestamp: new Date().toISOString(),
    });
  },
  getFailures() {
    return violationFailures.slice();
  },
  clear() {
    violationFailures.length = 0;
  },
};
