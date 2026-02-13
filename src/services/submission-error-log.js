const submissionFailures = [];

export const submissionErrorLog = {
  logFailure(details) {
    submissionFailures.push({
      ...details,
      timestamp: new Date().toISOString(),
    });
  },
  getFailures() {
    return submissionFailures.slice();
  },
  clear() {
    submissionFailures.length = 0;
  },
};
