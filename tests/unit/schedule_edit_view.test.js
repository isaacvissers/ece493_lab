import { jest } from '@jest/globals';
import { createScheduleEditView } from '../../src/views/schedule_edit_view.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('toggles status and editable state', () => {
  const view = createScheduleEditView();
  document.body.appendChild(view.element);
  view.setStatus('Error', true);
  expect(view.element.querySelector('#schedule-edit-status').className).toContain('error');
  view.setEditable(false);
  expect(view.element.querySelector('#editConferenceId').disabled).toBe(true);
  view.setEditable(true);
  expect(view.element.querySelector('#editConferenceId').disabled).toBe(false);
});

test('renders draft entries and version', () => {
  const view = createScheduleEditView();
  document.body.appendChild(view.element);
  view.setDraft({
    entries: [
      {
        entryId: 'entry_1',
        paperId: 'paper_1',
        roomId: 'room_a',
        startTime: '2026-05-01T09:00:00.000Z',
        endTime: '2026-05-01T09:30:00.000Z',
      },
    ],
    summary: 'Draft schedule version 1.',
  });
  expect(view.element.textContent).toContain('Draft schedule version 1.');
  view.setVersion(2);
  expect(view.element.querySelector('#editScheduleVersion').value).toBe('2');
});

test('renders draft entries with itemId and clears version', () => {
  const view = createScheduleEditView();
  document.body.appendChild(view.element);
  view.setDraft({
    entries: [
      {
        itemId: 'item_1',
        paperId: 'paper_2',
        roomId: 'room_b',
        startTime: '2026-05-01T10:00:00.000Z',
        endTime: '2026-05-01T10:30:00.000Z',
      },
    ],
    summary: '',
  });
  expect(view.element.textContent).toContain('item_1');
  view.setVersion(null);
  expect(view.element.querySelector('#editScheduleVersion').value).toBe('');
});

test('shows empty draft message when no entries', () => {
  const view = createScheduleEditView();
  document.body.appendChild(view.element);
  view.setDraft({ entries: [], summary: '' });
  expect(view.element.textContent).toContain('No draft entries available');
});

test('setDraft uses defaults when no args provided', () => {
  const view = createScheduleEditView();
  document.body.appendChild(view.element);
  view.setDraft();
  expect(view.element.textContent).toContain('No draft entries available');
});

test('ignores unknown field errors and wires save handler', () => {
  const view = createScheduleEditView();
  document.body.appendChild(view.element);
  view.setFieldError('unknown', 'Nope');
  const handler = jest.fn();
  view.onSave(handler);
  view.element.querySelector('form').dispatchEvent(new Event('submit'));
  expect(handler).toHaveBeenCalled();
});
