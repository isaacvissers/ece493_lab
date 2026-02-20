import { jest } from '@jest/globals';
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

test('redirects unauthenticated authors and resumes after login', () => {
  scheduleRepository.savePapers([
    { paperId: 'paper_login', status: 'accepted', authorIds: ['author_login'], conferenceId: 'conf_login' },
  ]);
  scheduleRepository.saveDraft({
    conferenceId: 'conf_login',
    items: [
      {
        entryId: 'entry_login',
        paperId: 'paper_login',
        roomId: 'Room L',
        startTime: '2026-06-17T09:00:00.000Z',
        endTime: '2026-06-17T09:30:00.000Z',
        status: 'scheduled',
      },
    ],
  });
  scheduleRepository.publishSchedule({ conferenceId: 'conf_login' });

  const view = createAuthorScheduleView();
  document.body.appendChild(view.element);
  const onAuthRequired = jest.fn();
  const controller = createAuthorScheduleController({
    view,
    sessionState,
    scheduleService,
    onAuthRequired,
  });

  controller.show('conf_login');
  expect(onAuthRequired).toHaveBeenCalled();

  sessionState.authenticate({ id: 'author_login', email: 'login@example.com' });
  controller.resumePending();
  expect(view.element.textContent).toContain('Room L');
});
