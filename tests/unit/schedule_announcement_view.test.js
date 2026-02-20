import { createScheduleAnnouncementView } from '../../src/views/schedule_announcement_view.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('renders announcement with custom content', () => {
  const view = createScheduleAnnouncementView();
  document.body.appendChild(view.element);
  view.setAnnouncement({
    titleText: 'Schedule Released',
    summaryText: 'View the final schedule.',
    scheduleLink: '/public/schedule',
    lastUpdatedAt: '2026-06-01T08:00:00.000Z',
  });
  expect(view.element.textContent).toContain('Schedule Released');
  expect(view.element.textContent).toContain('View the final schedule.');
  expect(view.element.textContent).toContain('Last updated: 2026-06-01T08:00:00.000Z');
});

test('setAnnouncement uses defaults when values missing', () => {
  const view = createScheduleAnnouncementView();
  document.body.appendChild(view.element);
  view.setAnnouncement();
  expect(view.element.textContent).toContain('Final schedule published');
});

test('hides link when pending', () => {
  const view = createScheduleAnnouncementView();
  document.body.appendChild(view.element);
  view.setPending();
  const link = view.element.querySelector('a');
  expect(link.hidden).toBe(true);
  expect(view.element.textContent).toContain('Schedule not available yet.');
});
