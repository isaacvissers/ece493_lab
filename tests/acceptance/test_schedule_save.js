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

function setValues(view) {
  view.element.querySelector('#conferenceId').value = 'conf_save';
  view.element.querySelector('#startDate').value = '2026-05-01T09:00';
  view.element.querySelector('#endDate').value = '2026-05-01T10:00';
  view.element.querySelector('#slotDurationMinutes').value = '30';
  view.element.querySelector('#rooms').value = 'Room A | 100';
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

test('save draft persists schedule state', () => {
  scheduleRepository.savePapers([
    { paperId: 'p1', status: 'accepted', requiredMetadataComplete: true, conferenceId: 'conf_save' },
  ]);
  sessionState.authenticate({ id: 'acct_admin', email: 'admin@example.com', role: 'Admin' });
  const { view } = setup();
  setValues(view);
  submit(view);
  view.element.querySelector('#schedule-save').click();
  const schedule = scheduleRepository.getSchedule('conf_save');
  expect(schedule.status).toBe('saved');
});
