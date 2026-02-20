import { createScheduleEditView } from '../../src/views/schedule_edit_view.js';
import { createScheduleEditController } from '../../src/controllers/schedule_edit_controller.js';
import { createConference } from '../../src/models/conference.js';
import { scheduleRepository } from '../../src/services/schedule_repository.js';
import { scheduleService } from '../../src/services/schedule_service.js';
import { auditLogService } from '../../src/services/audit_log_service.js';
import { notificationService } from '../../src/services/notification_service.js';
import { sessionState } from '../../src/models/session-state.js';

beforeEach(() => {
  scheduleRepository.reset();
  auditLogService.reset();
  notificationService.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('schedule edits respond within 200 ms for typical data', () => {
  const conference = createConference({
    conferenceId: 'conf_perf_edit',
    timeWindowStart: '2026-05-01T08:00:00.000Z',
    timeWindowEnd: '2026-05-01T18:00:00.000Z',
  });
  scheduleRepository.saveConference(conference);
  const items = [];
  for (let i = 0; i < 50; i += 1) {
    items.push({
      entryId: `entry_${i}`,
      paperId: `paper_${i}`,
      roomId: `room_${i % 5}`,
      startTime: `2026-05-01T${String(9 + (i % 6)).padStart(2, '0')}:00:00.000Z`,
      endTime: `2026-05-01T${String(9 + (i % 6)).padStart(2, '0')}:30:00.000Z`,
      status: 'scheduled',
    });
  }
  const schedule = scheduleRepository.saveDraft({
    conferenceId: conference.conferenceId,
    items,
  });

  sessionState.authenticate({ id: 'acct_editor', role: 'Editor' });
  const view = createScheduleEditView();
  document.body.appendChild(view.element);
  const controller = createScheduleEditController({
    view,
    sessionState,
    scheduleService,
    auditLogService,
    notificationService,
  });
  controller.show(conference.conferenceId);

  view.element.querySelector('#editConferenceId').value = conference.conferenceId;
  view.element.querySelector('#editEntryId').value = 'entry_1';
  view.element.querySelector('#editRoomId').value = 'room_9';
  view.element.querySelector('#editStartTime').value = '2026-05-01T11:00';
  view.element.querySelector('#editEndTime').value = '2026-05-01T11:30';
  view.element.querySelector('#editScheduleVersion').value = String(schedule.version);

  const start = Date.now();
  controller.save({ preventDefault: () => {} });
  const elapsed = Date.now() - start;
  expect(elapsed).toBeLessThan(200);
});
