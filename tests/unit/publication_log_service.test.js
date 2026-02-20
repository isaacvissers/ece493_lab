import { publicationLogService } from '../../src/services/publication_log_service.js';

beforeEach(() => {
  publicationLogService.reset();
});

test('records publication failures', () => {
  publicationLogService.logFailure({ context: 'publish', errorMessage: 'publish_failed', relatedId: 'conf_pub' });
  const logs = publicationLogService.getLogs();
  expect(logs).toHaveLength(1);
  expect(logs[0].status).toBe('failure');
  expect(logs[0].context).toBe('publish');
  expect(logs[0].errorMessage).toBe('publish_failed');
  expect(logs[0].relatedId).toBe('conf_pub');
});

test('logs success with defaults', () => {
  publicationLogService.logSuccess();
  const logs = publicationLogService.getLogs();
  expect(logs).toHaveLength(1);
  expect(logs[0].status).toBe('success');
  expect(logs[0].context).toBe('publish');
});

test('log defaults are applied when missing arguments', () => {
  publicationLogService.log();
  const logs = publicationLogService.getLogs();
  expect(logs[0].status).toBe('failure');
  expect(logs[0].context).toBe('publish');
});

test('logFailure uses defaults when missing arguments', () => {
  publicationLogService.logFailure();
  const logs = publicationLogService.getLogs();
  expect(logs[0].status).toBe('failure');
  expect(logs[0].context).toBe('publish');
});

test('prunes publication logs older than 90 days', () => {
  const now = Date.now();
  const oldDate = new Date(now - 100 * 24 * 60 * 60 * 1000).toISOString();
  const recentDate = new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString();
  publicationLogService.log({ status: 'failure', context: 'publish', createdAt: oldDate });
  publicationLogService.log({ status: 'failure', context: 'render', createdAt: recentDate });
  const remaining = publicationLogService.pruneOlderThan(90, now);
  expect(remaining.length).toBe(1);
  expect(remaining[0].context).toBe('render');
});

test('retains logs with invalid timestamps', () => {
  publicationLogService.log({ status: 'failure', context: 'render', createdAt: 'invalid-date' });
  const remaining = publicationLogService.pruneOlderThan(90, Date.now());
  expect(remaining).toHaveLength(1);
});

test('pruneOlderThan uses default retention', () => {
  publicationLogService.log({ status: 'failure', context: 'render', createdAt: new Date().toISOString() });
  const remaining = publicationLogService.pruneOlderThan();
  expect(remaining).toHaveLength(1);
});
