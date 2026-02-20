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

function setValues(view, overrides = {}) {
  view.element.querySelector('#conferenceId').value = overrides.conferenceId || 'conf_accept';
  view.element.querySelector('#startDate').value = overrides.startDate || '2026-05-01T09:00';
  view.element.querySelector('#endDate').value = overrides.endDate || '2026-05-01T10:00';
  view.element.querySelector('#slotDurationMinutes').value = overrides.slotDurationMinutes || '30';
  view.element.querySelector('#rooms').value = overrides.rooms || 'Room A | 100';
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

test('generates a draft schedule for accepted papers', () => {
  scheduleRepository.savePapers([
    { paperId: 'p1', status: 'accepted', requiredMetadataComplete: true, conferenceId: 'conf_accept' },
  ]);
  sessionState.authenticate({ id: 'acct_admin', email: 'admin@example.com', role: 'Admin' });
  const { view } = setup();
  setValues(view);
  submit(view);
  const listText = view.element.querySelector('#schedule-list').textContent;
  expect(listText).toContain('p1');
  expect(view.element.querySelector('#schedule-status').textContent).toContain('Draft schedule generated');
});
