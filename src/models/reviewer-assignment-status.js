export const REVIEWER_ASSIGNMENT_STATUS = Object.freeze({
  pending: 'pending',
  accepted: 'accepted',
  declined: 'declined',
  active: 'active',
});

export const ACCEPTED_REVIEWER_STATUSES = [
  REVIEWER_ASSIGNMENT_STATUS.accepted,
  REVIEWER_ASSIGNMENT_STATUS.active,
];
