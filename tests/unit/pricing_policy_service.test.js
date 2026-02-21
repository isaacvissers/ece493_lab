import { pricingPolicyService } from '../../src/services/pricing_policy_service.js';

beforeEach(() => {
  pricingPolicyService.reset();
});

test('defaults to public access and tbd missing display', () => {
  const policy = pricingPolicyService.getPolicy();
  expect(policy.accessLevel).toBe('public');
  expect(policy.missingItemDisplay).toBe('tbd');
});

test('reads registered-only access and omit display settings', () => {
  pricingPolicyService.setAccessLevel('registered');
  pricingPolicyService.setMissingItemDisplay('omit');
  const policy = pricingPolicyService.getPolicy();
  expect(policy.accessLevel).toBe('registered_only');
  expect(policy.missingItemDisplay).toBe('omit');
});

test('accepts registered_only access level values', () => {
  pricingPolicyService.setAccessLevel('registered_only');
  const policy = pricingPolicyService.getPolicy();
  expect(policy.accessLevel).toBe('registered_only');
});
