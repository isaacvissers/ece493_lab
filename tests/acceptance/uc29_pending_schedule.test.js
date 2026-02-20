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

test('shows pending message when schedule is not published', () => {
  scheduleRepository.savePapers([
    { paperId: 'paper_pending', status: 'accepted', authorIds: ['author_pending'], conferenceId: 'conf_pending' },
  ]);
  scheduleRepository.saveDraft({ conferenceId: 'conf_pending', items: [] });

  sessionState.authenticate({ id: 'author_pending', email: 'pending@example.com' });
  const view = createAuthorScheduleView();
  document.body.appendChild(view.element);
  const controller = createAuthorScheduleController({ view, sessionState, scheduleService });
  controller.show('conf_pending');

  expect(view.element.textContent).toContain('Schedule not available yet');
});
