import { createAuthorScheduleView } from '../../src/views/author_schedule_view.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('author schedule view includes accessibility attributes', () => {
  const view = createAuthorScheduleView();
  document.body.appendChild(view.element);
  const status = view.element.querySelector('#author-schedule-status');
  const summary = view.element.querySelector('#author-schedule-summary');
  const scheduledList = view.element.querySelector('#author-schedule-list');
  const unscheduledList = view.element.querySelector('#author-schedule-unscheduled');
  expect(status.getAttribute('aria-live')).toBe('polite');
  expect(summary.getAttribute('aria-live')).toBe('polite');
  expect(scheduledList.getAttribute('aria-live')).toBe('polite');
  expect(unscheduledList.getAttribute('aria-live')).toBe('polite');
});
