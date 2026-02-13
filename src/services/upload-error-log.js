const uploadFailures = [];

export const uploadErrorLog = {
  logFailure(details) {
    uploadFailures.push({
      ...details,
      timestamp: new Date().toISOString(),
    });
  },
  getFailures() {
    return uploadFailures.slice();
  },
  clear() {
    uploadFailures.length = 0;
  },
};
