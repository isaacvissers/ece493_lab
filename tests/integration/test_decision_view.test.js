import { createDecisionDetailView } from '../../src/views/decision_detail_view.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('decision detail view hides notes when absent', () => {
  const view = createDecisionDetailView();
  document.body.append(view.element);
  view.setStatus('Loaded', false);
  expect(view.element.querySelector('#decision-status').textContent).toBe('Loaded');
  view.setDecision({
    paper: { title: 'Paper' },
    decision: { value: 'accept', notes: '' },
  });
  const notes = view.element.querySelector('#decision-notes');
  expect(notes.textContent).toBe('');
});

test('decision detail view shows notes when provided', () => {
  const view = createDecisionDetailView();
  document.body.append(view.element);
  view.setDecision({
    paper: { title: 'Paper' },
    decision: { value: 'reject', notes: 'Needs work' },
  });
  const notes = view.element.querySelector('#decision-notes');
  expect(notes.textContent).toContain('Needs work');
});

test('decision detail view clears when decision missing', () => {
  const view = createDecisionDetailView();
  document.body.append(view.element);
  view.setDecision({
    paper: { title: 'Paper' },
    decision: null,
  });
  expect(view.element.querySelector('#decision-value').textContent).toBe('');
});
