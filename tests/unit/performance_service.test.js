import { performanceService } from '../../src/services/performance_service.js';

test('measures elapsed time with default now', () => {
  const start = performanceService.now();
  const elapsed = performanceService.elapsedSince(start);
  expect(elapsed).toBeGreaterThanOrEqual(0);
});

test('measures elapsed time with provided now', () => {
  const elapsed = performanceService.elapsedSince(100, 250);
  expect(elapsed).toBe(150);
});
