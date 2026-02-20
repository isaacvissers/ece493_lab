import { createScheduleEditView } from '../../src/views/schedule_edit_view.js';
import { createScheduleEditController } from '../../src/controllers/schedule_edit_controller.js';
import { createScheduleHtmlView } from '../../src/views/schedule_html_view.js';
import { createScheduleHtmlController } from '../../src/controllers/schedule_html_controller.js';
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

test('HTML schedule reflects updated draft after publish', () => {
  const conference = createConference({
    conferenceId: 'conf_html_edit',
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
  const editView = createScheduleEditView();
  document.body.appendChild(editView.element);
  const editController = createScheduleEditController({
    view: editView,
    sessionState,
    scheduleService,
    auditLogService,
    notificationService,
  });
  editController.show(conference.conferenceId);

  editView.element.querySelector('#editConferenceId').value = conference.conferenceId;
  editView.element.querySelector('#editEntryId').value = 'entry_1';
  editView.element.querySelector('#editRoomId').value = 'room_b';
  editView.element.querySelector('#editStartTime').value = '2026-05-01T10:00';
  editView.element.querySelector('#editEndTime').value = '2026-05-01T10:30';
  editView.element.querySelector('#editScheduleVersion').value = String(schedule.version);
  editController.save({ preventDefault: () => {} });

  scheduleRepository.publishSchedule({ conferenceId: conference.conferenceId });

  const htmlView = createScheduleHtmlView();
  document.body.appendChild(htmlView.element);
  const htmlController = createScheduleHtmlController({
    view: htmlView,
    sessionState,
    scheduleService,
  });
  htmlController.show(conference.conferenceId);

  expect(htmlView.element.textContent).toContain('room_b');
  expect(htmlView.element.textContent).toContain('2026-05-01T10:00');
});
