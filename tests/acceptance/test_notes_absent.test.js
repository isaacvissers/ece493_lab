import { createDecisionDetailView } from '../../src/views/decision_detail_view.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('decision notes absent are not shown', () => {
  const view = createDecisionDetailView();
  document.body.appendChild(view.element);
  view.setDecision({
    paper: { title: 'Paper' },
    decision: { value: 'accept', notes: null },
  });
  expect(view.element.querySelector('#decision-notes').textContent).toBe('');
});
