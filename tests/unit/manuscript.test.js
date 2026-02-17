import { createManuscript, validateManuscript } from '../../src/models/manuscript.js';

function buildValues(overrides = {}) {
  return {
    title: 'A Study on Testing',
    authorNames: 'Author One, Author Two',
    affiliations: 'OpenAI',
    contactEmail: 'author@example.com',
    abstract: 'Abstract text',
    keywords: 'testing, quality',
    mainSource: 'Main source content',
    ...overrides,
  };
}

test('valid manuscript passes validation', () => {
  const result = validateManuscript(buildValues());
  expect(result.ok).toBe(true);
  expect(result.errors).toEqual({});
});

test('missing required fields fail validation', () => {
  const result = validateManuscript(buildValues({ title: '', keywords: '' }));
  expect(result.ok).toBe(false);
  expect(result.errors.title).toBe('required');
  expect(result.errors.keywords).toBe('required');
});

test('whitespace-only required fields are missing', () => {
  const result = validateManuscript(buildValues({ abstract: '   ' }));
  expect(result.ok).toBe(false);
  expect(result.errors.abstract).toBe('required');
});

test('invalid email is rejected', () => {
  const result = validateManuscript(buildValues({ contactEmail: 'invalid' }));
  expect(result.ok).toBe(false);
  expect(result.errors.contactEmail).toBe('invalid_email');
});

test('author names require at least one name', () => {
  const result = validateManuscript(buildValues({ authorNames: ' , ' }));
  expect(result.ok).toBe(false);
  expect(result.errors.authorNames).toBe('invalid_author_names');
});

test('author names required when missing', () => {
  const result = validateManuscript(buildValues({ authorNames: '' }));
  expect(result.ok).toBe(false);
  expect(result.errors.authorNames).toBe('required');
});

test('keywords must be comma separated and non-empty', () => {
  const result = validateManuscript(buildValues({ keywords: 'one, , two' }));
  expect(result.ok).toBe(false);
  expect(result.errors.keywords).toBe('invalid_keywords');
});

test('creates manuscript with metadata and status', () => {
  const manuscript = createManuscript(buildValues(), {
    originalName: 'paper.pdf',
    fileType: 'pdf',
    fileSizeBytes: 1024,
  }, 'author@example.com');
  expect(manuscript.id).toContain('ms_');
  expect(manuscript.status).toBe('submitted');
  expect(manuscript.file.originalName).toBe('paper.pdf');
  expect(manuscript.submittedBy).toBe('author@example.com');
});

test('creates manuscript with null submittedBy when omitted', () => {
  const manuscript = createManuscript(buildValues(), {
    originalName: 'paper.pdf',
    fileType: 'pdf',
    fileSizeBytes: 1024,
  });
  expect(manuscript.submittedBy).toBe(null);
});
