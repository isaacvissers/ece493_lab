import { createDecisionQueueView } from '../../src/views/decisionQueueView.js';
import { createDecisionEntryView } from '../../src/views/decisionEntryView.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('decision queue view renders empty state and status', () => {
  const view = createDecisionQueueView();
  document.body.appendChild(view.element);
  view.setStatus('Attention', true);
  expect(view.element.querySelector('#decision-queue-banner').textContent).toBe('Attention');
  view.setStatus('Ready', false);
  expect(view.element.querySelector('#decision-queue-banner').textContent).toBe('Ready');
  view.setStatus('', false);
  expect(view.element.querySelector('#decision-queue-banner').textContent).toBe('');
  view.setPapers();
  view.setPapers([]);
  expect(view.element.querySelector('#decision-queue-list').textContent).toContain('No eligible papers');
});

test('decision entry view handles empty reviews and selection defaults', () => {
  const view = createDecisionEntryView();
  document.body.appendChild(view.element);
  view.setStatus('All set', false);
  expect(view.element.querySelector('#decision-banner').textContent).toBe('All set');
  view.setStatus('', false);
  expect(view.element.querySelector('#decision-banner').textContent).toBe('');
  view.setReviews();
  view.setReviews([]);
  expect(view.element.querySelector('#decision-reviews').textContent).toContain('No submitted reviews');
  view.setReviews('not-an-array');
  expect(view.element.querySelector('#decision-reviews').textContent).toContain('No submitted reviews');
  expect(view.getSelection()).toBe('');
});

test('decision queue view falls back to paper identifiers', () => {
  const view = createDecisionQueueView();
  document.body.appendChild(view.element);
  view.setPapers('not-an-array');
  expect(view.element.querySelector('#decision-queue-list').textContent).toContain('No eligible papers');
  view.setPapers([
    { paper: { id: 'paper_1', title: 'Paper One' }, reviewCount: 3 },
    { paper: { id: 'paper_2', title: '' }, reviewCount: 3 },
    { paper: {}, reviewCount: 3 },
  ]);
  const items = view.element.querySelectorAll('.decision-queue-item');
  expect(items[0].textContent).toContain('Paper One');
  expect(items[1].textContent).toContain('paper_2');
  expect(items[2].textContent).toContain('Paper');
});

test('decision entry view renders review summaries and fallbacks', () => {
  const view = createDecisionEntryView();
  document.body.appendChild(view.element);
  view.setReviews([
    { content: { summary: 'Summary A' } },
    { content: {} },
  ]);
  const items = view.element.querySelectorAll('.decision-review');
  expect(items).toHaveLength(2);
  expect(items[0].textContent).toContain('Summary A');
  expect(items[1].textContent).toContain('Review 2');
  view.element.querySelector('#decision-accept').checked = true;
  expect(view.getSelection()).toBe('accept');
  view.element.querySelector('#decision-reject').checked = true;
  expect(view.getSelection()).toBe('reject');
});
