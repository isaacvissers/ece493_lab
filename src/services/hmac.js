import crypto from 'crypto';

function normalizeSignature(signature = '') {
  const trimmed = String(signature ?? '').trim();
  if (trimmed.startsWith('sha256=')) {
    return trimmed.slice('sha256='.length);
  }
  return trimmed;
}

export function computeHmac(payload, secret, encoding = 'hex') {
  return crypto.createHmac('sha256', secret).update(payload).digest(encoding);
}

export function verifyHmac({ payload, signature, secret, encoding = 'hex' } = {}) {
  const normalized = normalizeSignature(signature);
  if (!payload || !secret || !normalized) {
    return false;
  }
  const expected = computeHmac(payload, secret, encoding);
  const expectedBuffer = Buffer.from(expected, encoding);
  const providedBuffer = Buffer.from(normalized, encoding);
  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
}
