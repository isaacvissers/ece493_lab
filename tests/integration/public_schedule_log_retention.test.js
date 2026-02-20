import { publicationLogService } from '../../src/services/publication_log_service.js';

beforeEach(() => {
  publicationLogService.reset();
});

test('prunes publication logs older than 90 days', () => {
  const now = Date.now();
  const oldDate = new Date(now - 120 * 24 * 60 * 60 * 1000).toISOString();
  const recentDate = new Date(now - 20 * 24 * 60 * 60 * 1000).toISOString();
  publicationLogService.log({ status: 'failure', context: 'publish', createdAt: oldDate });
  publicationLogService.log({ status: 'failure', context: 'render', createdAt: recentDate });
  const remaining = publicationLogService.pruneOlderThan(90, now);
  expect(remaining).toHaveLength(1);
  expect(remaining[0].context).toBe('render');
});
