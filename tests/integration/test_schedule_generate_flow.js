import { createScheduleDraftView } from '../../src/views/schedule_draft_view.js';
import { createScheduleController } from '../../src/controllers/schedule_controller.js';
import { scheduleRepository } from '../../src/services/schedule_repository.js';
import { sessionState } from '../../src/models/session-state.js';

function setup() {
  const view = createScheduleDraftView();
  document.body.appendChild(view.element);
  const controller = createScheduleController({ view, sessionState });
  controller.init();
  return { view, controller };
}

function setValues(view, overrides = {}) {
  view.element.querySelector('#conferenceId').value = overrides.conferenceId || 'conf_1';
  view.element.querySelector('#startDate').value = overrides.startDate || '2026-05-01T09:00';
  view.element.querySelector('#endDate').value = overrides.endDate || '2026-05-01T11:00';
  view.element.querySelector('#slotDurationMinutes').value = overrides.slotDurationMinutes || '30';
  view.element.querySelector('#rooms').value = overrides.rooms || 'Room A | 100\nRoom B | 80';
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

test('generate schedule creates draft and stores items', () => {
  scheduleRepository.savePapers([
    { paperId: 'p1', status: 'accepted', requiredMetadataComplete: true, conferenceId: 'conf_1' },
    { paperId: 'p2', status: 'accepted', requiredMetadataComplete: true, conferenceId: 'conf_1' },
  ]);
  sessionState.authenticate({ id: 'acct_admin', email: 'admin@example.com', role: 'Admin' });
  const { view } = setup();
  setValues(view);
  submit(view);
  const schedule = scheduleRepository.getSchedule('conf_1');
  expect(schedule).toBeTruthy();
  const items = scheduleRepository.getScheduleItems(schedule.scheduleId);
  expect(items.length).toBe(2);
});
