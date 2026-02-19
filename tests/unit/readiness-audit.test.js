import { createReadinessAudit } from '../../src/models/readiness-audit.js';
import { readinessAudit } from '../../src/services/readiness-audit.js';

beforeEach(() => {
  readinessAudit.clear();
});

test('createReadinessAudit assigns defaults', () => {
  const audit = createReadinessAudit({ paperId: 'paper_1', result: 'ready' });
  expect(audit.auditId).toMatch(/^audit_/);
  expect(audit.count).toBeNull();
  expect(audit.reason).toBe('');
  expect(typeof audit.timestamp).toBe('string');
});

test('createReadinessAudit honors provided values', () => {
  const audit = createReadinessAudit({
    auditId: 'audit_custom',
    paperId: 'paper_9',
    result: 'blocked',
    count: 2,
    reason: 'count_low',
    timestamp: '2024-01-01T00:00:00.000Z',
  });
  expect(audit.auditId).toBe('audit_custom');
  expect(audit.count).toBe(2);
  expect(audit.reason).toBe('count_low');
  expect(audit.timestamp).toBe('2024-01-01T00:00:00.000Z');
});

test('createReadinessAudit handles missing args', () => {
  const audit = createReadinessAudit();
  expect(audit.auditId).toMatch(/^audit_/);
});

test('readinessAudit records and returns entries', () => {
  const entry = readinessAudit.record({ paperId: 'paper_2', result: 'blocked', count: 2, reason: 'count_low' });
  const entries = readinessAudit.getEntries();
  expect(entries).toHaveLength(1);
  expect(entries[0]).toEqual(entry);
});

test('readinessAudit clears entries', () => {
  readinessAudit.record({ paperId: 'paper_3', result: 'ready', count: 3, reason: 'count_ok' });
  readinessAudit.clear();
  expect(readinessAudit.getEntries()).toHaveLength(0);
});

test('readinessAudit record handles missing args', () => {
  const entry = readinessAudit.record();
  expect(entry).toHaveProperty('auditId');
});
