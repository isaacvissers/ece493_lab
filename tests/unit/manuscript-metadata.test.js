import { createManuscriptMetadata } from '../../src/models/manuscript-metadata.js';

test('creates manuscript metadata with submission id and timestamp', () => {
  const metadata = createManuscriptMetadata('sub_1', {
    authorNames: 'Author One, Author Two',
    affiliations: 'Inst A, Inst B',
    contactEmail: 'author@example.com',
    abstract: 'Abstract',
    keywords: 'alpha, beta',
    mainSource: 'file upload',
  });
  expect(metadata.submissionId).toBe('sub_1');
  expect(metadata.authorNames).toContain('Author One');
  expect(metadata.updatedAt).toBeTruthy();
});
