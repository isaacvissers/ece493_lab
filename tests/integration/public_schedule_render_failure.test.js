import { createPublicScheduleView } from '../../src/views/public_schedule_view.js';
import { createPublicScheduleController } from '../../src/controllers/public_schedule_controller.js';
import { scheduleRepository } from '../../src/services/schedule_repository.js';
import { publicationLogService } from '../../src/services/publication_log_service.js';

beforeEach(() => {
  scheduleRepository.reset();
  publicationLogService.reset();
  document.body.innerHTML = '';
});

test('render failure logs and shows friendly message', () => {
  scheduleRepository.saveDraft({
    conferenceId: 'conf_render',
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
  scheduleRepository.publishSchedule({ conferenceId: 'conf_render' });
  const view = createPublicScheduleView();
  view.renderSchedule = () => {
    throw new Error('render_failed');
  };
  document.body.appendChild(view.element);
  const controller = createPublicScheduleController({ view });
  controller.show('conf_render');
  expect(view.element.textContent).toContain('Schedule could not be displayed');
  expect(publicationLogService.getLogs().length).toBeGreaterThan(0);
});
