import { createAuthorScheduleView } from '../../src/views/author_schedule_view.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('renders scheduled and unscheduled entries', () => {
  const view = createAuthorScheduleView();
  document.body.appendChild(view.element);
  view.setSchedule({
    scheduled: [
      {
        paperId: 'paper_1',
        paperTitle: 'Paper One',
        roomName: 'Room A',
        startTime: '2026-06-01T09:00:00.000Z',
        endTime: '2026-06-01T09:30:00.000Z',
      },
    ],
    unscheduled: [
      { paperId: 'paper_2', paperTitle: 'Paper Two' },
    ],
    summaryText: 'Published schedule available.',
  });
  expect(view.element.textContent).toContain('Paper One');
  expect(view.element.textContent).toContain('Room A');
  expect(view.element.textContent).toContain('Unscheduled');
  expect(view.element.textContent).toContain('Contact the organizer');
});

test('sets pending state and clears summary', () => {
  const view = createAuthorScheduleView();
  document.body.appendChild(view.element);
  view.setPending('Schedule not available yet.');
  expect(view.element.textContent).toContain('Schedule not available yet');
  expect(view.element.querySelector('#author-schedule-summary').textContent).toBe('');
});

test('renders fallback schedule labels when details are missing', () => {
  const view = createAuthorScheduleView();
  document.body.appendChild(view.element);
  view.setSchedule({
    scheduled: [
      {
        paperId: 'paper_fallback',
      },
      {},
    ],
    unscheduled: [
      {},
      { paperId: 'paper_unscheduled' },
    ],
    summaryText: 'Schedule published.',
  });
  const text = view.element.textContent;
  expect(text).toContain('Untitled paper');
  expect(text).toContain('TBD room');
  expect(text).toContain('TBD time');
  expect(text).toContain('paper_unscheduled');
});

test('handles empty schedule input with defaults', () => {
  const view = createAuthorScheduleView();
  document.body.appendChild(view.element);
  view.setSchedule();
  const text = view.element.textContent;
  expect(text).toContain('No scheduled papers yet.');
  expect(text).toContain('No unscheduled papers.');
});

test('handles non-array schedule payloads', () => {
  const view = createAuthorScheduleView();
  document.body.appendChild(view.element);
  view.setSchedule({ scheduled: null, unscheduled: 'bad', summaryText: null });
  const text = view.element.textContent;
  expect(text).toContain('No scheduled papers yet.');
  expect(text).toContain('No unscheduled papers.');
});

test('setStatus uses default error flag', () => {
  const view = createAuthorScheduleView();
  document.body.appendChild(view.element);
  view.setStatus('Updated');
  const status = view.element.querySelector('#author-schedule-status');
  expect(status.textContent).toBe('Updated');
  expect(status.className).toBe('status');
});

test('setPending uses default message', () => {
  const view = createAuthorScheduleView();
  document.body.appendChild(view.element);
  view.setPending();
  expect(view.element.textContent).toContain('Schedule not available yet.');
});
