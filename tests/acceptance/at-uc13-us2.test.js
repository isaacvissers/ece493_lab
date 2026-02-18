import { createRefereeAssignmentView } from '../../src/views/referee-assignment-view.js';
import { createRefereeAssignmentController } from '../../src/controllers/referee-assignment-controller.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { sessionState } from '../../src/models/session-state.js';

function setup(paperId) {
  const view = createRefereeAssignmentView();
  document.body.appendChild(view.element);
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage,
    sessionState,
    paperId,
  });
  controller.init();
  return { view };
}

function submit(view) {
  const event = new Event('submit', { bubbles: true, cancelable: true });
  view.element.querySelector('form').dispatchEvent(event);
}

beforeEach(() => {
  assignmentStorage.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('unauthenticated users are redirected to login', () => {
  assignmentStorage.seedPaper({ id: 'paper_1', title: 'Paper', status: 'Submitted' });
  const { view } = setup('paper_1');
  submit(view);
  expect(view.element.querySelector('#assignment-banner').textContent).toContain('log in');
});

test('non-editor users are blocked with authorization message', () => {
  assignmentStorage.seedPaper({ id: 'paper_2', title: 'Paper', status: 'Submitted' });
  sessionState.authenticate({ id: 'acct_2', email: 'author@example.com', role: 'Author', createdAt: new Date().toISOString() });
  const { view } = setup('paper_2');
  submit(view);
  expect(view.element.querySelector('#authorization-banner').textContent)
    .toContain('You do not have permission');
});

test('ineligible papers block assignment', () => {
  assignmentStorage.seedPaper({ id: 'paper_3', title: 'Paper', status: 'Rejected' });
  sessionState.authenticate({ id: 'acct_3', email: 'editor@example.com', role: 'Editor', createdAt: new Date().toISOString() });
  const { view } = setup('paper_3');
  submit(view);
  expect(view.element.querySelector('#assignment-banner').textContent).toContain('not eligible');
});
