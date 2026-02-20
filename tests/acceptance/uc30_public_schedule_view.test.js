import { createPublicScheduleView } from '../../src/views/public_schedule_view.js';
import { createPublicScheduleController } from '../../src/controllers/public_schedule_controller.js';
import { scheduleRepository } from '../../src/services/schedule_repository.js';
import { submissionStorage } from '../../src/services/submission-storage.js';

beforeEach(() => {
  scheduleRepository.reset();
  submissionStorage.reset();
  document.body.innerHTML = '';
});

test('public user sees published schedule listings', () => {
  submissionStorage.saveSubmission({
    id: 'paper_1',
    title: 'Public Session',
    authorNames: 'Author A, Author B',
    abstract: 'An abstract.',
  });
  scheduleRepository.saveDraft({
    conferenceId: 'conf_public',
    items: [
      {
        entryId: 'entry_1',
        paperId: 'paper_1',
        roomName: 'Room A',
        startTime: '2026-06-01T10:00:00.000Z',
        endTime: '2026-06-01T10:30:00.000Z',
        session: 'Session Alpha',
      },
    ],
  });
  scheduleRepository.publishSchedule({ conferenceId: 'conf_public' });

  const view = createPublicScheduleView();
  document.body.appendChild(view.element);
  const controller = createPublicScheduleController({ view });
  controller.show('conf_public');

  const text = view.element.textContent;
  expect(text).toContain('Public Session');
  expect(text).toContain('Room A');
  expect(text).toContain('Session Alpha');
  expect(text).toContain('Author A');
  expect(text).toContain('An abstract.');
});
