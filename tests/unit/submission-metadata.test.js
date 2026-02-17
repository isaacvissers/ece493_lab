import { createSubmissionMetadata } from '../../src/models/submission-metadata.js';

test('creates submission metadata snapshot', () => {
  const metadata = createSubmissionMetadata({
    authorNames: 'Author One',
    affiliations: 'Institute',
    contactEmail: 'author@example.com',
    abstract: 'Abstract',
    keywords: 'alpha, beta',
    mainSource: 'file upload',
  });
  expect(metadata.authorNames).toBe('Author One');
  expect(metadata.mainSource).toBe('file upload');
});
