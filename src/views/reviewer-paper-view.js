function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

export function createReviewerPaperView() {
  const container = createElement('section', 'card');
  const title = createElement('h1');
  title.textContent = 'Paper details';

  const banner = createElement('div', 'status');
  banner.id = 'paper-banner';
  banner.setAttribute('aria-live', 'polite');
  banner.tabIndex = -1;

  const detail = createElement('div', 'helper');
  detail.id = 'paper-detail';

  const link = document.createElement('a');
  link.id = 'manuscript-link';
  link.className = 'button secondary';
  link.href = '#';
  link.textContent = 'View manuscript';

  container.append(title, banner, detail, link);

  function setStatus(message, isError) {
    banner.textContent = message || '';
    banner.className = isError ? 'status error' : 'status';
    if (isError) {
      banner.focus();
    }
  }

  return {
    element: container,
    setStatus,
    setPaper(paper, manuscript) {
      if (!paper) {
        detail.textContent = '';
        link.style.display = 'none';
        return;
      }
      detail.textContent = `${paper.title || 'Untitled'} (${paper.id})`;
      if (manuscript && manuscript.file) {
        link.style.display = '';
        link.textContent = `View manuscript (${manuscript.file.originalName || 'file'})`;
      } else {
        link.style.display = 'none';
      }
    },
  };
}
