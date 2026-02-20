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

test('shows pending state when schedule is not published', () => {
  scheduleRepository.savePapers([
    { paperId: 'paper_unpub', status: 'accepted', authorIds: ['author_unpub'], conferenceId: 'conf_unpub' },
  ]);
  scheduleRepository.saveDraft({ conferenceId: 'conf_unpub', items: [] });

  sessionState.authenticate({ id: 'author_unpub', email: 'unpub@example.com' });
  const view = createAuthorScheduleView();
  document.body.appendChild(view.element);
  const controller = createAuthorScheduleController({ view, sessionState, scheduleService });
  controller.show('conf_unpub');

  expect(view.element.textContent).toContain('Schedule not available yet');
});
