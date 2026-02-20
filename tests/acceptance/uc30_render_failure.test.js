import { createPublicScheduleView } from '../../src/views/public_schedule_view.js';
import { createPublicScheduleController } from '../../src/controllers/public_schedule_controller.js';
import { scheduleRepository } from '../../src/services/schedule_repository.js';
import { publicationLogService } from '../../src/services/publication_log_service.js';

beforeEach(() => {
  scheduleRepository.reset();
  publicationLogService.reset();
  document.body.innerHTML = '';
});

test('render failure shows friendly error and logs failure', () => {
  scheduleRepository.saveDraft({
    conferenceId: 'conf_render_fail',
    items: [
      {
        entryId: 'entry_1',
        paperId: 'paper_1',
        roomName: 'Room A',
        startTime: '2026-06-01T10:00:00.000Z',
        endTime: '2026-06-01T10:30:00.000Z',
      },
    ],
  });
  scheduleRepository.publishSchedule({ conferenceId: 'conf_render_fail' });

  const view = createPublicScheduleView();
  view.renderSchedule = () => {
    throw new Error('render_failed');
  };
  document.body.appendChild(view.element);
  const controller = createPublicScheduleController({ view });
  controller.show('conf_render_fail');

  expect(view.element.textContent).toContain('Schedule could not be displayed');
  const logs = publicationLogService.getLogs();
  expect(logs.length).toBeGreaterThan(0);
  expect(logs[0].context).toBe('render');
});
