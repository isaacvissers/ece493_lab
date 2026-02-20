import { createPublicScheduleView } from '../../src/views/public_schedule_view.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('public schedule uses readable listing headings', () => {
  const view = createPublicScheduleView();
  document.body.appendChild(view.element);
  view.renderSchedule({
    entries: [
      {
        day: '2026-06-01',
        time: '09:00 - 09:30',
        room: 'Room A',
        session: 'Track 1',
        paperTitle: 'Readable Paper',
        authors: ['Author A'],
        abstract: 'Abstract text.',
      },
    ],
    unscheduled: [],
    lastUpdatedAt: '2026-06-01T08:00:00.000Z',
  });
  const headers = Array.from(view.element.querySelectorAll('th')).map((th) => th.textContent);
  expect(headers).toEqual(['Time', 'Room', 'Session', 'Title', 'Authors', 'Abstract']);
  expect(view.element.textContent).toContain('2026-06-01');
});
