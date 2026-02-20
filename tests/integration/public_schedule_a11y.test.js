import { createPublicScheduleView } from '../../src/views/public_schedule_view.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('public schedule view includes accessibility attributes', () => {
  const view = createPublicScheduleView();
  document.body.appendChild(view.element);
  const status = view.element.querySelector('#public-schedule-status');
  const loading = view.element.querySelector('#public-schedule-loading');
  expect(status.getAttribute('aria-live')).toBe('polite');
  expect(loading.getAttribute('aria-live')).toBe('polite');
});
