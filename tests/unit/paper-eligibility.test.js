import {
  assignReferees,
  createPaper,
  isEligibleStatus,
  isPaperAvailable,
} from '../../src/models/paper.js';

test('eligible status is submitted only', () => {
  expect(isEligibleStatus('Submitted')).toBe(true);
  expect(isEligibleStatus('eligible')).toBe(true);
  expect(isEligibleStatus('Withdrawn')).toBe(false);
  expect(isEligibleStatus(null)).toBe(false);
});

test('assignReferees updates emails and version', () => {
  const paper = createPaper({ id: 'paper_1', assignmentVersion: 0 });
  const updated = assignReferees(paper, ['a@example.com', 'b@example.com', 'c@example.com']);
  expect(updated.assignedRefereeEmails).toHaveLength(3);
  expect(updated.assignmentVersion).toBe(1);
});

test('createPaper generates an id when missing', () => {
  const paper = createPaper({ title: 'Generated' });
  expect(paper.id).toMatch(/^paper_/);
  const defaultPaper = createPaper();
  expect(defaultPaper.id).toMatch(/^paper_/);
  const nonArray = createPaper({ assignedRefereeEmails: 'not-an-array' });
  expect(nonArray.assignedRefereeEmails).toEqual([]);
});

test('paper availability handles missing, withdrawn, and manuscript flags', () => {
  expect(isPaperAvailable(null)).toBe(false);
  const base = createPaper({ id: 'paper_1', status: 'available', manuscriptAvailable: true });
  expect(isPaperAvailable(base)).toBe(true);
  expect(isPaperAvailable({ ...base, status: 'withdrawn' })).toBe(false);
  expect(isPaperAvailable({ ...base, status: 'removed' })).toBe(false);
  expect(isPaperAvailable({ ...base, manuscriptAvailable: false })).toBe(false);
  expect(isPaperAvailable({ ...base, status: undefined })).toBe(true);
});
