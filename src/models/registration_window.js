export function createRegistrationWindow({
  startAt = null,
  endAt = null,
  isOpen = false,
} = {}) {
  return {
    startAt,
    endAt,
    isOpen: Boolean(isOpen),
  };
}
