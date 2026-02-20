import { createPublicScheduleView } from '../../src/views/public_schedule_view.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('renders schedule entries with day grouping', () => {
  const view = createPublicScheduleView();
  document.body.appendChild(view.element);
  view.renderSchedule({
    entries: [
      {
        day: '2026-06-01',
        time: '09:00 - 09:30',
        room: 'Room A',
        session: 'Session A',
        paperTitle: 'Paper A',
        authors: ['Author A'],
        abstract: 'Abstract A',
      },
    ],
    unscheduled: [],
    lastUpdatedAt: '2026-06-01T08:00:00.000Z',
  });
  expect(view.element.textContent).toContain('2026-06-01');
  expect(view.element.textContent).toContain('Paper A');
  expect(view.element.textContent).toContain('Author A');
  expect(view.element.textContent).toContain('Last updated: 2026-06-01T08:00:00.000Z');
});

test('renders unscheduled items with fallback authors', () => {
  const view = createPublicScheduleView();
  document.body.appendChild(view.element);
  view.renderSchedule({
    entries: [],
    unscheduled: [
      { paperTitle: 'Paper B', authors: [] },
    ],
  });
  expect(view.element.textContent).toContain('Unscheduled');
  expect(view.element.textContent).toContain('Authors unavailable');
});

test('shows empty message when no entries provided', () => {
  const view = createPublicScheduleView();
  document.body.appendChild(view.element);
  view.renderSchedule();
  expect(view.element.textContent).toContain('No schedule available.');
});

test('setPending uses default message and clears content', () => {
  const view = createPublicScheduleView();
  document.body.appendChild(view.element);
  view.setPending();
  expect(view.element.textContent).toContain('Schedule not available yet.');
});

test('setStatus updates status class', () => {
  const view = createPublicScheduleView();
  document.body.appendChild(view.element);
  view.setStatus('Error', true);
  const status = view.element.querySelector('#public-schedule-status');
  expect(status.textContent).toBe('Error');
  expect(status.className).toContain('error');
  view.setStatus('Ok');
  expect(status.textContent).toBe('Ok');
  expect(status.className).toBe('status');
});

test('uses fallback values for missing entry fields', () => {
  const view = createPublicScheduleView();
  document.body.appendChild(view.element);
  view.renderSchedule({
    entries: [
      {
        day: '',
        time: '',
        room: '',
        session: '',
        paperTitle: '',
        authors: null,
        abstract: '',
      },
    ],
    unscheduled: [
      { paperTitle: '', authors: [] },
    ],
  });
  const text = view.element.textContent;
  expect(text).toContain('TBD time');
  expect(text).toContain('TBD room');
  expect(text).toContain('Session');
  expect(text).toContain('Untitled paper');
  expect(text).toContain('Authors unavailable');
  expect(text).toContain('Abstract not available.');
});
