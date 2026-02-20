import { announcementService } from '../../src/services/announcement_service.js';
import { scheduleRepository } from '../../src/services/schedule_repository.js';

beforeEach(() => {
  scheduleRepository.reset();
});

test('returns not_published when schedule missing', () => {
  const result = announcementService.getAnnouncement({ conferenceId: 'conf_none' });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('not_published');
});

test('returns not_published when called without arguments', () => {
  const result = announcementService.getAnnouncement();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('not_published');
});

test('returns announcement when schedule published', () => {
  scheduleRepository.saveDraft({
    conferenceId: 'conf_announce',
    items: [],
  });
  scheduleRepository.publishSchedule({ conferenceId: 'conf_announce' });
  const result = announcementService.getAnnouncement({ conferenceId: 'conf_announce' });
  expect(result.ok).toBe(true);
  expect(result.announcement.scheduleLink).toBe('/public/schedule');
});

test('falls back to now when timestamps missing', () => {
  const scheduleRepositoryStub = {
    getSchedule: () => ({ conferenceId: 'conf_stub', status: 'published' }),
  };
  const result = announcementService.getAnnouncement({
    conferenceId: 'conf_stub',
    scheduleRepository: scheduleRepositoryStub,
    now: '2026-06-01T00:00:00.000Z',
  });
  expect(result.ok).toBe(true);
  expect(result.announcement.lastUpdatedAt).toBe('2026-06-01T00:00:00.000Z');
});

test('uses publishedAt when updatedAt missing', () => {
  const scheduleRepositoryStub = {
    getSchedule: () => ({
      conferenceId: 'conf_stub',
      status: 'published',
      publishedAt: '2026-06-02T00:00:00.000Z',
    }),
  };
  const result = announcementService.getAnnouncement({
    conferenceId: 'conf_stub',
    scheduleRepository: scheduleRepositoryStub,
  });
  expect(result.ok).toBe(true);
  expect(result.announcement.lastUpdatedAt).toBe('2026-06-02T00:00:00.000Z');
});
