export const overassignmentAlert = {
  build({ count, blocked = [], guidanceAction = null } = {}) {
    const base = `Over-assignment blocked. Current reviewer count: ${count}.`;
    const guidance = guidanceAction
      || 'Remove/unassign or replace reviewers to return to three. Contact admin if removal is unavailable.';
    const blockedList = blocked.length
      ? ` Blocked additions: ${blocked.join(', ')}.`
      : '';
    return {
      message: `${base} ${guidance}${blockedList}`.trim(),
      count,
      blocked,
    };
  },
};
