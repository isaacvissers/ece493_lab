import { jest } from '@jest/globals';
import { createRefereeGuidanceView } from '../../src/views/referee-guidance-view.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('guidance view renders message and action', () => {
  const view = createRefereeGuidanceView();
  document.body.appendChild(view.element);
  view.setGuidance({ message: 'Add referees to reach three.', actionLabel: 'Add referees', action: 'add' });
  expect(view.element.querySelector('#guidance-message').textContent).toContain('Add referees');
  expect(view.element.querySelector('#guidance-action').textContent).toBe('Add referees');
});

test('guidance view triggers action handler', () => {
  const view = createRefereeGuidanceView();
  document.body.appendChild(view.element);
  const handler = jest.fn();
  view.onAction(handler);
  view.setGuidance({ message: 'Remove a referee.', actionLabel: 'Remove referee', action: 'remove' });
  view.element.querySelector('#guidance-action').click();
  expect(handler).toHaveBeenCalledWith('remove');
});
