import { createScheduleHtmlView } from '../../src/views/schedule_html_view.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('toggles loading and status states', () => {
  const view = createScheduleHtmlView();
  document.body.appendChild(view.element);
  view.setLoading(true);
  expect(view.element.querySelector('#schedule-html-loading').hidden).toBe(false);
  view.setLoading(false);
  expect(view.element.querySelector('#schedule-html-loading').hidden).toBe(true);
  view.setStatus('Error', true);
  expect(view.element.querySelector('#schedule-html-status').className).toContain('error');
  view.setStatus();
  expect(view.element.querySelector('#schedule-html-status').textContent).toBe('');
});

test('renders schedule and unscheduled sections', () => {
  const view = createScheduleHtmlView();
  document.body.appendChild(view.element);
  view.renderSchedule({
    rooms: [
      { roomName: 'Room A', items: [{ paperTitle: 'Paper A', startTime: '2026-05-01T09:00:00.000Z', endTime: '2026-05-01T09:30:00.000Z' }] },
      { roomName: 'Room B', items: [{ paperTitle: '', startTime: '', endTime: '' }] },
    ],
    unscheduled: [{ paperTitle: 'Paper B' }, { paperTitle: '' }],
  });
  expect(view.element.textContent).toContain('Room A');
  expect(view.element.textContent).toContain('Untitled paper');
  expect(view.element.textContent).toContain('Paper B');
});

test('renders empty schedule message', () => {
  const view = createScheduleHtmlView();
  document.body.appendChild(view.element);
  view.renderSchedule({ rooms: [], unscheduled: [] });
  expect(view.element.textContent).toContain('No schedule available');
  view.renderSchedule();
  expect(view.element.textContent).toContain('No schedule available');
});
