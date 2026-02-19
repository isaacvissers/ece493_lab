import { jest } from '@jest/globals';
import { createRefereeGuidanceView } from '../../src/views/referee-guidance-view.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('referee guidance view handles actions and disabled state', () => {
  const view = createRefereeGuidanceView();
  document.body.appendChild(view.element);

  const button = view.element.querySelector('#guidance-action');

  view.setGuidance({ message: 'Ready', actionLabel: '', action: null });
  expect(button.disabled).toBe(true);

  button.click();

  const handler = jest.fn();
  view.onAction(handler);
  view.setGuidance({ message: 'Take action', actionLabel: 'Do it', action: 'add' });
  expect(button.disabled).toBe(false);

  button.click();
  expect(handler).toHaveBeenCalledWith('add');

  view.setGuidance({ message: 'Missing action', actionLabel: 'No op', action: null });
  button.click();
  expect(handler).toHaveBeenCalledTimes(1);
});
