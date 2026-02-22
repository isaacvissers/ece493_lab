import { computeHmac, verifyHmac } from '../../src/services/hmac.js';

test('computeHmac returns deterministic signature', () => {
  const sig = computeHmac('payload', 'secret');
  const sig2 = computeHmac('payload', 'secret');
  expect(sig).toBe(sig2);
});

test('verifyHmac returns true for matching signature', () => {
  const payload = 'test-body';
  const secret = 'shared';
  const signature = computeHmac(payload, secret);
  const result = verifyHmac({ payload, signature, secret });
  expect(result).toBe(true);
});

test('verifyHmac supports sha256 prefix', () => {
  const payload = 'body';
  const secret = 'shared';
  const signature = `sha256=${computeHmac(payload, secret)}`;
  expect(verifyHmac({ payload, signature, secret })).toBe(true);
});

test('verifyHmac fails on missing inputs', () => {
  expect(verifyHmac()).toBe(false);
  expect(verifyHmac({ payload: 'a', secret: 'b' })).toBe(false);
});

test('verifyHmac fails on length mismatch', () => {
  const payload = 'data';
  const secret = 'shared';
  const signature = Buffer.from(computeHmac(payload, secret), 'hex').toString('base64');
  expect(verifyHmac({ payload, signature, secret })).toBe(false);
});
