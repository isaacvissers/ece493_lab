import { createPublicScheduleView } from '../../src/views/public_schedule_view.js';
import { createPublicScheduleController } from '../../src/controllers/public_schedule_controller.js';
import { scheduleRepository } from '../../src/services/schedule_repository.js';
import { submissionStorage } from '../../src/services/submission-storage.js';

beforeEach(() => {
  scheduleRepository.reset();
  submissionStorage.reset();
  document.body.innerHTML = '';
});

test('renders published public schedule response', () => {
  submissionStorage.saveSubmission({
    id: 'paper_public',
    title: 'Public Title',
    authorNames: 'Author One',
    abstract: 'Public abstract',
  });
  scheduleRepository.saveDraft({
    conferenceId: 'conf_public',
    items: [
      {
        entryId: 'entry_public',
        paperId: 'paper_public',
        roomName: 'Room A',
        startTime: '2026-06-02T09:00:00.000Z',
        endTime: '2026-06-02T09:30:00.000Z',
        session: 'Track A',
      },
    ],
  });
  scheduleRepository.publishSchedule({ conferenceId: 'conf_public' });
  const view = createPublicScheduleView();
  document.body.appendChild(view.element);
  const controller = createPublicScheduleController({ view });
  controller.show('conf_public');
  expect(view.element.textContent).toContain('Public Title');
  expect(view.element.textContent).toContain('Track A');
});
