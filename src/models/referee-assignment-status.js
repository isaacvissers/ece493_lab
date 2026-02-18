export const REFEREE_ASSIGNMENT_STATUS = Object.freeze({
  pending: 'pending',
  accepted: 'accepted',
  declined: 'declined',
  withdrawn: 'withdrawn',
});

export const NON_DECLINED_REFEREE_STATUSES = [
  REFEREE_ASSIGNMENT_STATUS.pending,
  REFEREE_ASSIGNMENT_STATUS.accepted,
];
