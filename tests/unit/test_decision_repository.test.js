import { decisionRepository } from '../../src/services/decision_repository.js';

beforeEach(() => {
  decisionRepository.reset();
});

test('lists pending decisions when release time has not arrived', () => {
  decisionRepository.seedPaper({
    paperId: 'paper_pending',
    title: 'Pending Paper',
    authorIds: ['author_1'],
    decisionReleaseAt: new Date(Date.now() + 60000).toISOString(),
  });
  decisionRepository.seedDecision({
    decisionId: 'decision_pending',
    paperId: 'paper_pending',
    value: 'accept',
  });

  const list = decisionRepository.listDecisionsForAuthor({ authorId: 'author_1', now: Date.now() });
  expect(list[0].status).toBe('pending');
  expect(list[0].decision).toBeNull();
});

test('returns decision for author after release', () => {
  decisionRepository.seedPaper({
    paperId: 'paper_release',
    title: 'Release Paper',
    authorIds: ['author_2'],
    decisionReleaseAt: new Date(Date.now() - 1000).toISOString(),
  });
  decisionRepository.seedDecision({
    decisionId: 'decision_release',
    paperId: 'paper_release',
    value: 'accept',
  });

  const result = decisionRepository.getDecisionForAuthor({ paperId: 'paper_release', authorId: 'author_2', now: Date.now() });
  expect(result.ok).toBe(true);
  expect(result.decision.value).toBe('accept');
});

test('blocks access for non-authors', () => {
  decisionRepository.seedPaper({
    paperId: 'paper_block',
    title: 'Blocked Paper',
    authorIds: ['author_3'],
  });
  decisionRepository.seedDecision({
    decisionId: 'decision_block',
    paperId: 'paper_block',
    value: 'reject',
  });

  const result = decisionRepository.getDecisionForAuthor({ paperId: 'paper_block', authorId: 'author_4', now: Date.now() });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('access_denied');
});

test('returns error when paper is missing', () => {
  const result = decisionRepository.getDecisionForAuthor({ paperId: 'missing', authorId: 'author_5' });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('paper_not_found');
});

test('returns missing when decision not found', () => {
  decisionRepository.seedPaper({ paperId: 'paper_no_decision', authorIds: ['author_6'] });
  const result = decisionRepository.getDecisionForAuthor({ paperId: 'paper_no_decision', authorId: 'author_6' });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('decision_missing');
});

test('saveDecision rejects invalid input', () => {
  const result = decisionRepository.saveDecision();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('invalid_decision');
});

test('getDecisionById returns null for missing id', () => {
  const decision = decisionRepository.getDecisionById();
  expect(decision).toBeNull();
});
