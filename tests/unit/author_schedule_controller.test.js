import { jest } from '@jest/globals';
import { createAuthorScheduleController } from '../../src/controllers/author_schedule_controller.js';
import { createAuthorScheduleView } from '../../src/views/author_schedule_view.js';
import { scheduleRepository, __test__ as scheduleRepoTest } from '../../src/services/schedule_repository.js';
import { sessionState } from '../../src/models/session-state.js';

beforeEach(() => {
  sessionState.clear();
  scheduleRepository.reset();
  document.body.innerHTML = '';
});

test('resumePending is a no-op when nothing is pending', () => {
  const view = createAuthorScheduleView();
  document.body.appendChild(view.element);
  const scheduleService = { getPublishedScheduleForAuthor: jest.fn() };
  const controller = createAuthorScheduleController({
    view,
    sessionState,
    scheduleService,
    authService: { requireAuth: () => ({ ok: true, user: { id: 'author_1' } }) },
  });
  controller.resumePending();
  expect(scheduleService.getPublishedScheduleForAuthor).not.toHaveBeenCalled();
});

test('createAuthorScheduleController handles default inputs', () => {
  const controller = createAuthorScheduleController();
  expect(controller.view).toBeUndefined();
});

test('show passes null authorId when user is missing', () => {
  const view = createAuthorScheduleView();
  document.body.appendChild(view.element);
  const scheduleService = { getPublishedScheduleForAuthor: jest.fn(() => ({ ok: false, reason: 'access_denied' })) };
  const controller = createAuthorScheduleController({
    view,
    sessionState,
    scheduleService,
    authService: { requireAuth: () => ({ ok: true, user: null }) },
  });
  controller.show('conf_missing_author');
  expect(scheduleService.getPublishedScheduleForAuthor).toHaveBeenCalledWith({
    conferenceId: 'conf_missing_author',
    authorId: null,
  });
});

test('show uses user id when available', () => {
  const view = createAuthorScheduleView();
  document.body.appendChild(view.element);
  const scheduleService = { getPublishedScheduleForAuthor: jest.fn(() => ({ ok: false, reason: 'access_denied' })) };
  const controller = createAuthorScheduleController({
    view,
    sessionState,
    scheduleService,
    authService: { requireAuth: () => ({ ok: true, user: { id: 'author_id' } }) },
  });
  controller.show('conf_id');
  expect(scheduleService.getPublishedScheduleForAuthor).toHaveBeenCalledWith({
    conferenceId: 'conf_id',
    authorId: 'author_id',
  });
});

test('show prefers authorId when id is missing', () => {
  const view = createAuthorScheduleView();
  document.body.appendChild(view.element);
  const scheduleService = { getPublishedScheduleForAuthor: jest.fn(() => ({ ok: false, reason: 'access_denied' })) };
  const controller = createAuthorScheduleController({
    view,
    sessionState,
    scheduleService,
    authService: { requireAuth: () => ({ ok: true, user: { authorId: 'author_alt' } }) },
  });
  controller.show('conf_alt');
  expect(scheduleService.getPublishedScheduleForAuthor).toHaveBeenCalledWith({
    conferenceId: 'conf_alt',
    authorId: 'author_alt',
  });
});

test('show uses userId fallback when id missing', () => {
  const view = createAuthorScheduleView();
  document.body.appendChild(view.element);
  const scheduleService = { getPublishedScheduleForAuthor: jest.fn(() => ({ ok: false, reason: 'access_denied' })) };
  const controller = createAuthorScheduleController({
    view,
    sessionState,
    scheduleService,
    authService: { requireAuth: () => ({ ok: true, user: { userId: 'user_alt' } }) },
  });
  controller.show('conf_user');
  expect(scheduleService.getPublishedScheduleForAuthor).toHaveBeenCalledWith({
    conferenceId: 'conf_user',
    authorId: 'user_alt',
  });
});

test('show uses email fallback when id missing', () => {
  const view = createAuthorScheduleView();
  document.body.appendChild(view.element);
  const scheduleService = { getPublishedScheduleForAuthor: jest.fn(() => ({ ok: false, reason: 'access_denied' })) };
  const controller = createAuthorScheduleController({
    view,
    sessionState,
    scheduleService,
    authService: { requireAuth: () => ({ ok: true, user: { email: 'fallback@example.com' } }) },
  });
  controller.show('conf_email');
  expect(scheduleService.getPublishedScheduleForAuthor).toHaveBeenCalledWith({
    conferenceId: 'conf_email',
    authorId: 'fallback@example.com',
  });
});

test('show returns null authorId when user has no identifiers', () => {
  const view = createAuthorScheduleView();
  document.body.appendChild(view.element);
  const scheduleService = { getPublishedScheduleForAuthor: jest.fn(() => ({ ok: false, reason: 'access_denied' })) };
  const controller = createAuthorScheduleController({
    view,
    sessionState,
    scheduleService,
    authService: { requireAuth: () => ({ ok: true, user: {} }) },
  });
  controller.show('conf_empty_user');
  expect(scheduleService.getPublishedScheduleForAuthor).toHaveBeenCalledWith({
    conferenceId: 'conf_empty_user',
    authorId: null,
  });
});

test('show uses default services and summary when publishedAt missing', () => {
  scheduleRepository.savePapers([
    { paperId: 'paper_default', status: 'accepted', authorIds: ['author_default'], conferenceId: 'conf_default' },
  ]);
  scheduleRepository.saveDraft({
    conferenceId: 'conf_default',
    items: [
      {
        entryId: 'entry_default',
        paperId: 'paper_default',
        roomId: 'Room D',
        startTime: '2026-06-19T09:00:00.000Z',
        endTime: '2026-06-19T09:30:00.000Z',
        status: 'scheduled',
      },
    ],
  });
  const schedule = scheduleRepository.publishSchedule({ conferenceId: 'conf_default' });
  scheduleRepoTest.persistSchedules([{ ...schedule, publishedAt: null }]);
  const view = createAuthorScheduleView();
  document.body.appendChild(view.element);
  sessionState.authenticate({ id: 'author_default', email: 'author_default@example.com' });
  const controller = createAuthorScheduleController({ view, sessionState });
  controller.show('conf_default');
  expect(view.element.textContent).toContain('Published schedule available');
});

test('show handles missing session state when user is missing', () => {
  const view = createAuthorScheduleView();
  document.body.appendChild(view.element);
  const scheduleService = { getPublishedScheduleForAuthor: jest.fn(() => ({ ok: false, reason: 'access_denied' })) };
  const controller = createAuthorScheduleController({
    view,
    sessionState: null,
    scheduleService,
    authService: { requireAuth: () => ({ ok: true, user: null }) },
  });
  controller.show('conf_no_session');
  expect(scheduleService.getPublishedScheduleForAuthor).toHaveBeenCalledWith({
    conferenceId: 'conf_no_session',
    authorId: null,
  });
});
