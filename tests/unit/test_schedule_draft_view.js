import { createScheduleDraftView } from '../../src/views/schedule_draft_view.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('renders empty draft states', () => {
  const view = createScheduleDraftView();
  document.body.appendChild(view.element);
  view.setDraft({ scheduled: [], unscheduled: [], summary: 'Empty' });
  expect(view.element.querySelector('#schedule-list').textContent).toContain('No scheduled papers');
  expect(view.element.querySelector('#schedule-unscheduled').textContent).toContain('No unscheduled papers');
});

test('renders scheduled and unscheduled items', () => {
  const view = createScheduleDraftView();
  document.body.appendChild(view.element);
  view.setDraft({
    scheduled: [{ paperId: 'p1', roomId: 'Room A', slotId: 'slot_1' }],
    unscheduled: [{ paperId: 'p2', reason: 'capacity_shortfall' }],
    summary: 'Two papers',
  });
  expect(view.element.querySelector('#schedule-list').textContent).toContain('p1');
  expect(view.element.querySelector('#schedule-unscheduled').textContent).toContain('capacity_shortfall');
});

test('updates status, errors, and editable state', () => {
  const view = createScheduleDraftView();
  document.body.appendChild(view.element);
  view.setFieldError('conferenceId', 'Missing');
  expect(view.element.querySelector('#conferenceId-error').textContent).toBe('Missing');
  view.setFieldError('missing', 'Ignored');
  view.setStatus('Error', true);
  expect(view.element.querySelector('#schedule-status').className).toContain('error');
  view.setEditable(false);
  expect(view.element.querySelector('#conferenceId').disabled).toBe(true);
  view.clearErrors();
  expect(view.element.querySelector('#conferenceId-error').textContent).toBe('');
});

test('setFieldError ignores unknown fields', () => {
  const view = createScheduleDraftView();
  document.body.appendChild(view.element);
  expect(() => view.setFieldError('not_real', 'Nope')).not.toThrow();
});

test('wires generate/save/publish handlers', () => {
  const view = createScheduleDraftView();
  document.body.appendChild(view.element);
  const generate = jest.fn((event) => event.preventDefault());
  const save = jest.fn();
  const publish = jest.fn();
  view.onGenerate(generate);
  view.onSave(save);
  view.onPublish(publish);
  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  view.element.querySelector('#schedule-save').click();
  view.element.querySelector('#schedule-publish').click();
  expect(generate).toHaveBeenCalled();
  expect(save).toHaveBeenCalled();
  expect(publish).toHaveBeenCalled();
});
