import { jest } from '@jest/globals';
import { createReviewerAssignmentsView } from '../../src/views/reviewer-assignments-view.js';

test('renders empty message when no assignments', () => {
  const view = createReviewerAssignmentsView();
  document.body.appendChild(view.element);
  view.setAssignments([]);
  expect(view.element.querySelector('#assignments-list').textContent)
    .toContain('No accepted assignments found');
});

test('defaults to empty assignments when omitted', () => {
  const view = createReviewerAssignmentsView();
  document.body.appendChild(view.element);
  view.setAssignments();
  expect(view.element.querySelector('#assignments-list').textContent)
    .toContain('No accepted assignments found');
});

test('invokes open handler when clicking open button', () => {
  const view = createReviewerAssignmentsView();
  document.body.appendChild(view.element);
  const onOpen = jest.fn();
  view.onOpen(onOpen);
  view.setAssignments([{ paperId: 'paper_1', title: 'Paper 1' }]);
  const button = view.element.querySelector('#assignments-list button.button.secondary');
  button.click();
  expect(onOpen).toHaveBeenCalledWith({ paperId: 'paper_1', title: 'Paper 1' });
});

test('falls back to paperId when title missing and skips open handler', () => {
  const view = createReviewerAssignmentsView();
  document.body.appendChild(view.element);
  view.setAssignments([{ paperId: 'paper_2', title: '' }]);
  const label = view.element.querySelector('#assignments-list span');
  expect(label.textContent).toBe('paper_2');
  const button = view.element.querySelector('#assignments-list button.button.secondary');
  button.click();
});
