import { createRefereeAssignmentView } from '../../src/views/referee-assignment-view.js';
import { createRefereeAssignmentController } from '../../src/controllers/referee-assignment-controller.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { sessionState } from '../../src/models/session-state.js';

beforeEach(() => {
  assignmentStore.reset();
  assignmentStorage.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('over-assignment check completes within 2 seconds', () => {
  assignmentStorage.seedPaper({ id: 'paper_perf', title: 'Paper', status: 'Submitted' });
  sessionState.authenticate({ id: 'acct_1', email: 'editor@example.com', role: 'Editor' });
  const view = createRefereeAssignmentView();
  document.body.appendChild(view.element);
  const controller = createRefereeAssignmentController({ view, assignmentStorage, sessionState, paperId: 'paper_perf' });
  const start = Date.now();
  controller.init();
  const duration = Date.now() - start;
  expect(duration).toBeLessThan(2000);
});
