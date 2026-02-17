const assignmentFailures = [];

export const assignmentErrorLog = {
  logFailure(details) {
    assignmentFailures.push({
      ...details,
      timestamp: new Date().toISOString(),
    });
  },
  getFailures() {
    return assignmentFailures.slice();
  },
  clear() {
    assignmentFailures.length = 0;
  },
};
