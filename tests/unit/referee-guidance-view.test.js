import { jest } from '@jest/globals';
import { createRefereeGuidanceView } from '../../src/views/referee-guidance-view.js';

function getActionButton(view) {
  return view.element.querySelector('#guidance-action');
}

test('referee guidance view updates message and action', () => {
  const view = createRefereeGuidanceView();
  document.body.appendChild(view.element);

  view.setGuidance({ message: 'Add referees', actionLabel: 'Add', action: 'add' });
  const message = view.element.querySelector('#guidance-message');
  const actionButton = getActionButton(view);

  expect(message.textContent).toBe('Add referees');
  expect(actionButton.textContent).toBe('Add');
  expect(actionButton.disabled).toBe(false);
});

test('referee guidance view disables action without label', () => {
  const view = createRefereeGuidanceView();
  document.body.appendChild(view.element);

  view.setGuidance({ message: 'No action', actionLabel: '', action: null });
  const actionButton = getActionButton(view);
  expect(actionButton.disabled).toBe(true);
});

test('referee guidance view triggers action handler on click', () => {
  const view = createRefereeGuidanceView();
  document.body.appendChild(view.element);
  const handler = jest.fn();
  view.onAction(handler);

  view.setGuidance({ message: 'Remove', actionLabel: 'Remove', action: 'remove' });
  getActionButton(view).click();

  expect(handler).toHaveBeenCalledWith('remove');
});

test('referee guidance view ignores clicks without an action', () => {
  const view = createRefereeGuidanceView();
  document.body.appendChild(view.element);
  const handler = jest.fn();
  view.onAction(handler);

  view.setGuidance({ message: 'No action', actionLabel: 'Go', action: null });
  getActionButton(view).click();

  expect(handler).not.toHaveBeenCalled();
});

test('referee guidance view defaults guidance when omitted', () => {
  const view = createRefereeGuidanceView();
  document.body.appendChild(view.element);

  view.setGuidance();
  const message = view.element.querySelector('#guidance-message');
  const actionButton = getActionButton(view);
  expect(message.textContent).toBe('');
  expect(actionButton.disabled).toBe(true);
});
