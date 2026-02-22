import { measure } from '../../src/services/perf_monitor.js';

test('measure returns failure when fn missing', () => {
  const result = measure();
  expect(result.ok).toBe(false);
});

test('measure reports duration and threshold', () => {
  const result = measure({
    thresholdMs: 0,
    fn: () => 'ok',
  });
  expect(result.ok).toBe(true);
  expect(result.result).toBe('ok');
  expect(result.exceeded).toBe(true);
});

test('measure falls back when performance is unavailable', () => {
  const original = global.performance;
  const originalNow = original && original.now;
  try {
    if (original) {
      Object.defineProperty(original, 'now', { value: undefined, configurable: true, writable: true });
    } else {
      global.performance = {};
    }
    const result = measure({ fn: () => 'fallback' });
    expect(result.ok).toBe(true);
    expect(result.result).toBe('fallback');
  } finally {
    if (original) {
      Object.defineProperty(original, 'now', { value: originalNow, configurable: true, writable: true });
      global.performance = original;
    } else {
      // eslint-disable-next-line no-undefined
      global.performance = undefined;
    }
  }
});
