function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

export function createDecisionDetailView() {
  const container = createElement('section', 'card');
  const title = createElement('h2');
  title.textContent = 'Decision detail';

  const status = createElement('div', 'status');
  status.id = 'decision-status';
  status.setAttribute('aria-live', 'polite');
  status.tabIndex = -1;

  const decisionValue = createElement('div', 'decision-status');
  decisionValue.id = 'decision-value';
  decisionValue.setAttribute('aria-live', 'polite');

  const notes = createElement('div');
  notes.id = 'decision-notes';
  notes.setAttribute('aria-live', 'polite');
  notes.setAttribute('aria-label', 'Decision notes');

  const pending = createElement('div', 'status warning');
  pending.id = 'decision-pending';

  container.append(title, status, decisionValue, notes, pending);

  function setStatus(message, isError) {
    status.textContent = message || '';
    status.className = isError ? 'status error' : 'status';
    if (isError) {
      status.focus();
    }
  }

  function setDecision({ paper, decision } = {}) {
    pending.textContent = '';
    const titleText = paper && paper.title ? paper.title : (paper && paper.paperId ? paper.paperId : 'Paper');
    title.textContent = `Decision for ${titleText}`;
    if (!decision) {
      decisionValue.textContent = '';
      notes.textContent = '';
      return;
    }
    decisionValue.textContent = decision.value ? `Decision: ${decision.value}` : '';
    const noteText = decision.notes || '';
    notes.textContent = noteText;
  }

  function setPending(releaseAt) {
    decisionValue.textContent = '';
    notes.textContent = '';
    pending.textContent = releaseAt ? `Pending until ${releaseAt}` : 'Pending decision release';
  }

  return {
    element: container,
    setStatus,
    setDecision,
    setPending,
  };
}
