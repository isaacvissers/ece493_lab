const invitationFailures = [];

export const invitationLog = {
  logFailure(details) {
    invitationFailures.push({
      ...details,
      timestamp: new Date().toISOString(),
    });
  },
  getFailures() {
    return invitationFailures.slice();
  },
  clear() {
    invitationFailures.length = 0;
  },
};
