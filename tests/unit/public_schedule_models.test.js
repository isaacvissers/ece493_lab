import { createPublicSchedule } from '../../src/models/public_schedule.js';
import { createAnnouncement } from '../../src/models/announcement.js';
import { createPublicationLog } from '../../src/models/publication_log.js';

test('createPublicSchedule uses defaults and normalizes entries', () => {
  const schedule = createPublicSchedule();
  expect(schedule.id).toBeTruthy();
  expect(schedule.status).toBe('unpublished');
  expect(schedule.entries).toEqual([]);
  const normalized = createPublicSchedule({ entries: 'bad' });
  expect(normalized.entries).toEqual([]);
});

test('createPublicSchedule accepts overrides', () => {
  const schedule = createPublicSchedule({
    id: 'pub_sched_1',
    status: 'published',
    publishedAt: '2026-06-01T00:00:00.000Z',
    lastUpdatedAt: '2026-06-02T00:00:00.000Z',
    entries: [{ id: 'entry_1' }],
    announcementId: 'ann_1',
  });
  expect(schedule.id).toBe('pub_sched_1');
  expect(schedule.status).toBe('published');
  expect(schedule.entries).toHaveLength(1);
});

test('createAnnouncement uses defaults', () => {
  const announcement = createAnnouncement();
  expect(announcement.id).toBeTruthy();
  expect(announcement.title).toBe('');
  expect(announcement.summary).toBe('');
  expect(announcement.scheduleLink).toBe('');
});

test('createPublicationLog uses defaults', () => {
  const log = createPublicationLog();
  expect(log.id).toBeTruthy();
  expect(log.status).toBe('failure');
  expect(log.context).toBe('publish');
  expect(log.timestamp).toBeTruthy();
});

test('createAnnouncement and createPublicationLog accept overrides', () => {
  const announcement = createAnnouncement({
    id: 'ann_1',
    title: 'Title',
    summary: 'Summary',
    scheduleLink: '/public/schedule',
    lastUpdatedAt: '2026-06-01T00:00:00.000Z',
  });
  expect(announcement.id).toBe('ann_1');
  expect(announcement.lastUpdatedAt).toBe('2026-06-01T00:00:00.000Z');
  const log = createPublicationLog({
    id: 'log_1',
    status: 'success',
    errorMessage: 'none',
    context: 'render',
    relatedId: 'conf_1',
    createdAt: '2026-06-01T00:00:00.000Z',
  });
  expect(log.id).toBe('log_1');
  expect(log.status).toBe('success');
  expect(log.context).toBe('render');
  expect(log.relatedId).toBe('conf_1');
  expect(log.timestamp).toBe('2026-06-01T00:00:00.000Z');
});
