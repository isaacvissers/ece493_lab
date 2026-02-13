const metadataFailures = [];

export const metadataErrorLog = {
  logFailure(details) {
    metadataFailures.push({
      ...details,
      timestamp: new Date().toISOString(),
    });
  },
  getFailures() {
    return metadataFailures.slice();
  },
  clear() {
    metadataFailures.length = 0;
  },
};
