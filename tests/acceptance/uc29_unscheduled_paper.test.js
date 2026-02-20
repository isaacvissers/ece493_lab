import { createAuthorScheduleView } from '../../src/views/author_schedule_view.js';
import { createAuthorScheduleController } from '../../src/controllers/author_schedule_controller.js';
import { scheduleRepository } from '../../src/services/schedule_repository.js';
import { scheduleService } from '../../src/services/schedule_service.js';
import { sessionState } from '../../src/models/session-state.js';

beforeEach(() => {
  scheduleRepository.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('shows unscheduled guidance for accepted papers without assignments', () => {
  scheduleRepository.savePapers([
    {
      paperId: 'paper_unscheduled',
      title: 'Waiting Paper',
      status: 'accepted',
      authorIds: ['author_wait'],
      conferenceId: 'conf_wait',
    },
  ]);
  scheduleRepository.saveDraft({
    conferenceId: 'conf_wait',
    items: [],
  });
  scheduleRepository.publishSchedule({ conferenceId: 'conf_wait' });

  sessionState.authenticate({ id: 'author_wait', email: 'wait@example.com' });
  const view = createAuthorScheduleView();
  document.body.appendChild(view.element);
  const controller = createAuthorScheduleController({ view, sessionState, scheduleService });
  controller.show('conf_wait');

  expect(view.element.textContent).toContain('Unscheduled');
  expect(view.element.textContent).toContain('Contact the organizer');
});
