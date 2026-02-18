export const refereeGuidance = {
  getGuidance({ count } = {}) {
    if (typeof count !== 'number') {
      return null;
    }
    if (count < 3) {
      return {
        action: 'add',
        message: 'Add referees to reach exactly three assignments before review.',
        actionLabel: 'Add referees',
      };
    }
    if (count > 3) {
      return {
        action: 'remove',
        message: 'Remove or replace referees to return to exactly three assignments.',
        actionLabel: 'Remove or replace referee',
      };
    }
    return null;
  },
};
