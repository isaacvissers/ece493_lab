import { createScheduleHtmlView } from '../../src/views/schedule_html_view.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('schedule HTML view includes accessibility attributes', () => {
  const view = createScheduleHtmlView();
  document.body.appendChild(view.element);
  const status = view.element.querySelector('#schedule-html-status');
  const loading = view.element.querySelector('#schedule-html-loading');
  expect(status.getAttribute('aria-live')).toBe('polite');
  expect(loading.getAttribute('aria-live')).toBe('polite');
});
