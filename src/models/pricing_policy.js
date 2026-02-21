export function createPricingPolicy({
  accessLevel = 'public',
  missingItemDisplay = 'tbd',
} = {}) {
  const normalizedAccess = accessLevel === 'registered_only' ? 'registered_only' : 'public';
  const normalizedMissing = missingItemDisplay === 'omit' ? 'omit' : 'tbd';
  return {
    accessLevel: normalizedAccess,
    missingItemDisplay: normalizedMissing,
  };
}
