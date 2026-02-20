import { scheduleRepository } from '../../src/services/schedule_repository.js';
import { scheduleService } from '../../src/services/schedule_service.js';
import { auditLogService } from '../../src/services/audit_log_service.js';
import { notificationService } from '../../src/services/notification_service.js';

beforeEach(() => {
  scheduleRepository.reset();
  auditLogService.reset();
  notificationService.reset();
});

test('handles persistence failure without updating schedule', () => {
  const schedule = scheduleRepository.saveDraft({
    conferenceId: 'conf_fail',
    items: [
      {
        entryId: 'entry_1',
        paperId: 'paper_1',
        roomId: 'room_a',
        startTime: '2026-05-01T09:00:00.000Z',
        endTime: '2026-05-01T09:30:00.000Z',
        status: 'scheduled',
      },
    ],
  });
  scheduleRepository.setFailureMode(true);

  const result = scheduleService.updateScheduleEntry({
    conferenceId: 'conf_fail',
    entryId: 'entry_1',
    roomId: 'room_b',
    startTime: '2026-05-01T10:00:00.000Z',
    endTime: '2026-05-01T10:30:00.000Z',
    scheduleVersion: schedule.version,
    auditLogService,
    notificationService,
  });

  expect(result.ok).toBe(false);
  expect(result.reason).toBe('save_failed');
  const logs = auditLogService.getLogs();
  expect(logs[0].eventType).toBe('schedule_edit_failed');
});
