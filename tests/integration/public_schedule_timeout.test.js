import { createPublicScheduleView } from '../../src/views/public_schedule_view.js';
import { createPublicScheduleController } from '../../src/controllers/public_schedule_controller.js';
import { scheduleRepository } from '../../src/services/schedule_repository.js';

beforeEach(() => {
  scheduleRepository.reset();
  document.body.innerHTML = '';
});

test('shows timeout message on slow render', () => {
  scheduleRepository.saveDraft({
    conferenceId: 'conf_timeout',
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
  scheduleRepository.publishSchedule({ conferenceId: 'conf_timeout' });
  const view = createPublicScheduleView();
  document.body.appendChild(view.element);
  let callCount = 0;
  const performanceService = {
    now: () => {
      callCount += 1;
      return callCount === 1 ? 0 : 5000;
    },
  };
  const controller = createPublicScheduleController({ view, performanceService, timeoutMs: 1000 });
  controller.show('conf_timeout');
  expect(view.element.textContent).toContain('Schedule loading timed out');
});
