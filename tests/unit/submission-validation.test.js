import { validateSubmission, submissionValidationRules } from '../../src/services/submission-validation.js';

function baseValues(overrides = {}) {
  return {
    authorNames: 'Author One',
    affiliations: 'Institute',
    contactEmail: 'author@example.com',
    abstract: 'Abstract',
    keywords: 'alpha, beta',
    mainSource: 'file upload',
    ...overrides,
  };
}

function makeFile(name) {
  return new File(['content'], name, { type: 'application/pdf', lastModified: Date.now() });
}

test('valid final submission passes', () => {
  const result = validateSubmission(baseValues(), makeFile('paper.pdf'), { mode: 'final' });
  expect(result.ok).toBe(true);
});

test('default mode uses final validation', () => {
  const result = validateSubmission(baseValues(), makeFile('paper.pdf'));
  expect(result.ok).toBe(true);
});

test('missing required fields fail on final submit', () => {
  const result = validateSubmission(baseValues({ authorNames: '' }), makeFile('paper.pdf'), { mode: 'final' });
  expect(result.ok).toBe(false);
  expect(result.errors.authorNames).toBe('required');
});

test('invalid email blocks final submit', () => {
  const result = validateSubmission(baseValues({ contactEmail: 'invalid' }), makeFile('paper.pdf'), { mode: 'final' });
  expect(result.ok).toBe(false);
  expect(result.errors.contactEmail).toBe('invalid_email');
});

test('missing email triggers required error on final submit', () => {
  const result = validateSubmission(baseValues({ contactEmail: '' }), makeFile('paper.pdf'), { mode: 'final' });
  expect(result.ok).toBe(false);
  expect(result.errors.contactEmail).toBe('required');
});

test('missing file blocks final submit', () => {
  const result = validateSubmission(baseValues(), null, { mode: 'final' });
  expect(result.ok).toBe(false);
  expect(result.errors.manuscriptFile).toBe('file_required');
});

test('invalid file type blocks final submit', () => {
  const result = validateSubmission(baseValues(), makeFile('paper.exe'), { mode: 'final' });
  expect(result.ok).toBe(false);
  expect(result.errors.manuscriptFile).toBe('file_type_invalid');
  expect(submissionValidationRules.allowedExtensions).toContain('doc');
});

test('file without extension is rejected', () => {
  const result = validateSubmission(baseValues(), makeFile('paper'), { mode: 'final' });
  expect(result.ok).toBe(false);
  expect(result.errors.manuscriptFile).toBe('file_type_invalid');
});

test('file with missing name is rejected', () => {
  const result = validateSubmission(baseValues(), { name: '' }, { mode: 'final' });
  expect(result.ok).toBe(false);
  expect(result.errors.manuscriptFile).toBe('file_type_invalid');
});

test('aggregates multiple errors', () => {
  const result = validateSubmission(baseValues({ contactEmail: 'bad', abstract: '' }), makeFile('paper.exe'), { mode: 'final' });
  expect(result.ok).toBe(false);
  expect(result.errors.contactEmail).toBe('invalid_email');
  expect(result.errors.abstract).toBe('required');
  expect(result.errors.manuscriptFile).toBe('file_type_invalid');
});

test('draft mode allows missing required fields', () => {
  const result = validateSubmission(baseValues({ authorNames: '', affiliations: '' }), null, { mode: 'draft' });
  expect(result.ok).toBe(true);
});

test('draft mode allows missing email', () => {
  const values = baseValues();
  delete values.contactEmail;
  const result = validateSubmission(values, null, { mode: 'draft' });
  expect(result.ok).toBe(true);
  expect(result.errors.contactEmail).toBeUndefined();
});

test('draft mode validates provided email and file type', () => {
  const invalidEmail = validateSubmission(baseValues({ contactEmail: 'bad' }), null, { mode: 'draft' });
  expect(invalidEmail.ok).toBe(false);
  expect(invalidEmail.errors.contactEmail).toBe('invalid_email');

  const invalidFile = validateSubmission(baseValues(), makeFile('paper.exe'), { mode: 'draft' });
  expect(invalidFile.ok).toBe(false);
  expect(invalidFile.errors.manuscriptFile).toBe('file_type_invalid');
});
