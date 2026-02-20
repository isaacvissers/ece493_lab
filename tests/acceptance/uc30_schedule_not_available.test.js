import { createPublicScheduleView } from '../../src/views/public_schedule_view.js';
import { createPublicScheduleController } from '../../src/controllers/public_schedule_controller.js';
import { scheduleRepository } from '../../src/services/schedule_repository.js';

beforeEach(() => {
  scheduleRepository.reset();
  document.body.innerHTML = '';
});

test('public schedule shows pending message before release', () => {
  scheduleRepository.saveDraft({
    conferenceId: 'conf_pending',
    items: [],
  });
  const view = createPublicScheduleView();
  document.body.appendChild(view.element);
  const controller = createPublicScheduleController({ view });
  controller.show('conf_pending');
  expect(view.element.textContent).toContain('Schedule not available yet.');
});
