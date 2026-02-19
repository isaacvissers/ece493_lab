import { createReviewerPaperView } from '../../src/views/reviewer-paper-view.js';

test('clears details when paper missing', () => {
  const view = createReviewerPaperView();
  document.body.appendChild(view.element);
  view.setPaper(null, null);
  const detail = view.element.querySelector('#paper-detail');
  const link = view.element.querySelector('#manuscript-link');
  expect(detail.textContent).toBe('');
  expect(link.style.display).toBe('none');
});

test('shows manuscript link when file is available', () => {
  const view = createReviewerPaperView();
  document.body.appendChild(view.element);
  view.setPaper({ id: 'paper_1', title: 'Title' }, { file: { originalName: 'paper.pdf' } });
  const link = view.element.querySelector('#manuscript-link');
  expect(link.style.display).toBe('');
  expect(link.textContent).toContain('paper.pdf');
});

test('hides manuscript link when file is missing', () => {
  const view = createReviewerPaperView();
  document.body.appendChild(view.element);
  view.setPaper({ id: 'paper_2', title: 'Title' }, { file: null });
  const link = view.element.querySelector('#manuscript-link');
  expect(link.style.display).toBe('none');
});

test('uses fallback title and file label when missing', () => {
  const view = createReviewerPaperView();
  document.body.appendChild(view.element);
  view.setPaper({ id: 'paper_3', title: '' }, { file: { originalName: '' } });
  const detail = view.element.querySelector('#paper-detail');
  const link = view.element.querySelector('#manuscript-link');
  expect(detail.textContent).toContain('Untitled');
  expect(link.textContent).toContain('file');
});
