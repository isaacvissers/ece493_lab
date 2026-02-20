import { createScheduleEditView } from '../../src/views/schedule_edit_view.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('schedule edit view includes accessibility attributes', () => {
  const view = createScheduleEditView();
  document.body.appendChild(view.element);
  const status = view.element.querySelector('#schedule-edit-status');
  expect(status.getAttribute('aria-live')).toBe('polite');
  const conferenceLabel = view.element.querySelector('label[for="editConferenceId"]');
  const conferenceInput = view.element.querySelector('#editConferenceId');
  expect(conferenceLabel).not.toBeNull();
  expect(conferenceInput.getAttribute('aria-describedby')).toBe('editConferenceId-error');
});
