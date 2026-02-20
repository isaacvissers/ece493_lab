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

test('saves a valid schedule entry update', () => {
  const conference = createConference({
    conferenceId: 'conf_edit',
    timeWindowStart: '2026-05-01T08:00:00.000Z',
    timeWindowEnd: '2026-05-01T12:00:00.000Z',
  });
  scheduleRepository.saveConference(conference);
  const schedule = scheduleRepository.saveDraft({
    conferenceId: conference.conferenceId,
    items: [
      {
        entryId: 'entry_1',
        paperId: 'paper_1',
        paperTitle: 'Paper One',
        roomId: 'room_a',
        startTime: '2026-05-01T09:00:00.000Z',
        endTime: '2026-05-01T09:30:00.000Z',
        status: 'scheduled',
      },
    ],
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
  view.element.querySelector('#editRoomId').value = 'room_b';
  view.element.querySelector('#editStartTime').value = '2026-05-01T10:00';
  view.element.querySelector('#editEndTime').value = '2026-05-01T10:30';
  view.element.querySelector('#editScheduleVersion').value = String(schedule.version);

  controller.save({ preventDefault: () => {} });

  const updated = scheduleRepository.getScheduleItems(schedule.scheduleId);
  expect(updated[0].roomId).toBe('room_b');
  expect(view.element.textContent).toContain('Schedule update saved');
});
