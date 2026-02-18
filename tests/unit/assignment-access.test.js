import { reviewerPaperAccess } from '../../src/services/reviewer-paper-access.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { submissionStorage } from '../../src/services/submission-storage.js';
import { createAssignment } from '../../src/models/assignment.js';
import { createManuscript } from '../../src/models/manuscript.js';

function seedManuscript(id, title) {
  const manuscript = createManuscript({
    title,
    authorNames: 'A',
    affiliations: 'B',
    contactEmail: 'a@example.com',
    abstract: 'Abstract',
    keywords: 'key',
    mainSource: 'upload',
  }, { originalName: `${id}.pdf` }, 'author@example.com');
  manuscript.id = id;
  submissionStorage.saveSubmission(manuscript);
}

beforeEach(() => {
  assignmentStore.reset();
  assignmentStorage.reset();
  submissionStorage.reset();
});

test('returns not_accepted when no accepted assignment exists', () => {
  assignmentStorage.seedPaper({ id: 'paper_1', title: 'Paper', status: 'available' });
  seedManuscript('paper_1', 'Paper');
  const result = reviewerPaperAccess.getPaperDetails({ reviewerEmail: 'reviewer@example.com', paperId: 'paper_1' });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('not_accepted');
});

test('returns ok when assignment accepted and manuscript available', () => {
  assignmentStorage.seedPaper({ id: 'paper_2', title: 'Paper', status: 'available' });
  seedManuscript('paper_2', 'Paper');
  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_2',
    reviewerEmail: 'reviewer@example.com',
    status: 'accepted',
  }));
  const result = reviewerPaperAccess.getPaperDetails({ reviewerEmail: 'reviewer@example.com', paperId: 'paper_2' });
  expect(result.ok).toBe(true);
  expect(result.paper.id).toBe('paper_2');
});
