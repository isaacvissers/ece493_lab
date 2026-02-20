import { createScheduleDraftView } from '../../src/views/schedule_draft_view.js';
import { createScheduleController } from '../../src/controllers/schedule_controller.js';
import { scheduleRepository } from '../../src/services/schedule_repository.js';
import { sessionState } from '../../src/models/session-state.js';

function setup() {
  const view = createScheduleDraftView();
  document.body.appendChild(view.element);
  const controller = createScheduleController({ view, sessionState });
  controller.init();
  return { view };
}

function submit(view) {
  const event = new Event('submit', { bubbles: true, cancelable: true });
  view.element.querySelector('form').dispatchEvent(event);
}

beforeEach(() => {
  scheduleRepository.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('missing inputs block generation with errors', () => {
  sessionState.authenticate({ id: 'acct_admin', email: 'admin@example.com', role: 'Admin' });
  const { view } = setup();
  view.element.querySelector('#conferenceId').value = '';
  view.element.querySelector('#startDate').value = '';
  view.element.querySelector('#endDate').value = '';
  view.element.querySelector('#slotDurationMinutes').value = '';
  view.element.querySelector('#rooms').value = '';
  submit(view);
  expect(view.element.querySelector('#conferenceId-error').textContent).toContain('required');
  expect(view.element.querySelector('#startDate-error').textContent).toContain('valid');
  expect(view.element.querySelector('#rooms-error').textContent).toContain('required');
  expect(view.element.querySelector('#schedule-status').textContent).toContain('Fix highlighted');
});
