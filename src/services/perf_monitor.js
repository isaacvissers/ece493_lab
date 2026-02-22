function now() {
  if (typeof performance !== 'undefined' && performance.now) {
    return performance.now();
  }
  return Date.now();
}

export function measure({ label = null, thresholdMs = 200, fn } = {}) {
  if (typeof fn !== 'function') {
    return { ok: false, label, durationMs: 0, exceeded: false };
  }
  const start = now();
  const result = fn();
  const durationMs = now() - start;
  return {
    ok: true,
    label,
    result,
    durationMs,
    exceeded: durationMs > thresholdMs,
  };
}
