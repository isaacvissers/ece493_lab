import { jest } from '@jest/globals';
import { createDecisionListView } from '../../src/views/decision_list_view.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('decision list view handles empty list', () => {
  const view = createDecisionListView();
  document.body.append(view.element);
  view.setStatus('Loading', false);
  expect(view.element.querySelector('#decision-list-status').textContent).toBe('Loading');
  view.setDecisions([]);
  expect(view.element.textContent).toContain('No decisions available');
});

test('decision list view renders items and triggers selection', () => {
  const view = createDecisionListView();
  document.body.append(view.element);
  view.setDecisions([
    { paper: { paperId: 'paper_1', title: 'Paper One' }, decision: { value: 'accept' }, status: 'released' },
  ]);
  const handler = jest.fn();
  view.onSelect(handler);
  view.element.querySelector('button').click();
  expect(handler).toHaveBeenCalledWith('paper_1');
});
