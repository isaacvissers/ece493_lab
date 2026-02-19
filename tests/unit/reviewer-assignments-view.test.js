import { jest } from '@jest/globals';
import { createReviewerAssignmentsView } from '../../src/views/reviewer-assignments-view.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('reviewer assignments view handles list rendering and open actions', () => {
  const view = createReviewerAssignmentsView();
  document.body.appendChild(view.element);

  view.setAssignments();
  const list = view.element.querySelector('#assignments-list');
  expect(list.querySelectorAll('li')).toHaveLength(1);
  expect(list.textContent).toContain('No accepted assignments found');

  const assignments = [
    { paperId: 'paper-1' },
    { paperId: 'paper-2', title: 'Paper Two' },
  ];
  view.setAssignments(assignments);

  const items = list.querySelectorAll('li');
  expect(items).toHaveLength(2);
  expect(items[0].querySelector('span').textContent).toBe('paper-1');
  expect(items[1].querySelector('span').textContent).toBe('Paper Two');

  const openButtons = list.querySelectorAll('button');
  openButtons[0].click();

  const onOpen = jest.fn();
  view.onOpen(onOpen);
  openButtons[1].click();
  expect(onOpen).toHaveBeenCalledWith(assignments[1]);
});

test('reviewer assignments view manages status, alerts, and refresh actions', () => {
  const view = createReviewerAssignmentsView();
  document.body.appendChild(view.element);

  const banner = view.element.querySelector('#assignments-banner');
  const bannerFocus = jest.spyOn(banner, 'focus');
  view.setStatus('All good', false);
  expect(banner.textContent).toBe('All good');
  expect(banner.className).toBe('status');

  view.setStatus('Failure', true);
  expect(banner.textContent).toBe('Failure');
  expect(banner.className).toBe('status error');
  expect(bannerFocus).toHaveBeenCalled();

  const alert = view.element.querySelector('#overassignment-alert');
  const alertFocus = jest.spyOn(alert, 'focus');
  expect(view.setAlert({ message: 'Over limit' })).toBe(true);
  expect(alert.textContent).toBe('Over limit');
  expect(alertFocus).toHaveBeenCalled();

  view.setAlertFallback('Fallback text');
  expect(view.element.querySelector('#overassignment-alert-fallback').textContent)
    .toBe('Fallback text');

  view.setAlertFailureMode(true);
  expect(view.setAlert({ message: 'Ignored' })).toBe(false);

  view.setAlertFailureMode(false);
  view.setAlert({ message: '' });
  expect(alert.textContent).toBe('');

  const refreshHandler = jest.fn();
  view.onRefresh(refreshHandler);
  view.element.querySelector('#assignments-refresh').click();
  expect(refreshHandler).toHaveBeenCalled();
});
