import { validateMetadata, metadataRules } from '../../src/services/metadata-validation.js';

function baseValues(overrides = {}) {
  return {
    authorNames: 'Author One; Author Two',
    affiliations: 'Institute A; Institute B',
    contactEmail: 'author@example.com',
    abstract: 'A short abstract.',
    keywords: 'alpha, beta, gamma',
    mainSource: 'file upload',
    ...overrides,
  };
}

test('valid metadata passes and normalizes lists', () => {
  const result = validateMetadata(baseValues(), { mode: 'final' });
  expect(result.ok).toBe(true);
  expect(result.values.authorNames).toBe('Author One, Author Two');
  expect(result.values.affiliations).toBe('Institute A, Institute B');
  expect(result.values.keywords).toBe('alpha, beta, gamma');
});

test('default mode validates as final', () => {
  const result = validateMetadata(baseValues());
  expect(result.ok).toBe(true);
});

test('missing required fields fail final validation', () => {
  const result = validateMetadata(baseValues({ authorNames: '', affiliations: '' }), { mode: 'final' });
  expect(result.ok).toBe(false);
  expect(result.errors.authorNames).toBe('required');
  expect(result.errors.affiliations).toBe('required');
});

test('invalid email is rejected', () => {
  const result = validateMetadata(baseValues({ contactEmail: 'invalid' }), { mode: 'final' });
  expect(result.ok).toBe(false);
  expect(result.errors.contactEmail).toBe('invalid_email');
});

test('keywords must be 1-10 comma-separated', () => {
  const zero = validateMetadata(baseValues({ keywords: '' }), { mode: 'final' });
  expect(zero.ok).toBe(false);
  expect(zero.errors.keywords).toBe('required');

  const tooMany = validateMetadata(baseValues({
    keywords: Array.from({ length: 11 }, (_, i) => `k${i}`).join(','),
  }), { mode: 'final' });
  expect(tooMany.ok).toBe(false);
  expect(tooMany.errors.keywords).toBe('invalid_keywords');

  const semicolon = validateMetadata(baseValues({ keywords: 'alpha; beta' }), { mode: 'final' });
  expect(semicolon.ok).toBe(false);
  expect(semicolon.errors.keywords).toBe('invalid_keywords');

  const emptyItem = validateMetadata(baseValues({ keywords: 'alpha, , beta' }), { mode: 'final' });
  expect(emptyItem.ok).toBe(false);
  expect(emptyItem.errors.keywords).toBe('invalid_keywords');
});

test('main source must be allowed value', () => {
  const result = validateMetadata(baseValues({ mainSource: 'other' }), { mode: 'final' });
  expect(result.ok).toBe(false);
  expect(result.errors.mainSource).toBe('invalid_source');
});

test('abstract length is enforced', () => {
  const longAbstract = 'a'.repeat(metadataRules.maxAbstractLength + 1);
  const result = validateMetadata(baseValues({ abstract: longAbstract }), { mode: 'final' });
  expect(result.ok).toBe(false);
  expect(result.errors.abstract).toBe('abstract_too_long');
});

test('draft validation allows missing required fields but validates provided formats', () => {
  const result = validateMetadata(baseValues({
    authorNames: '',
    affiliations: '',
    contactEmail: 'bad',
    keywords: 'alpha; beta',
  }), { mode: 'draft' });
  expect(result.ok).toBe(false);
  expect(result.errors.authorNames).toBeUndefined();
  expect(result.errors.contactEmail).toBe('invalid_email');
  expect(result.errors.keywords).toBe('invalid_keywords');
});

test('invalid author and affiliation separators are rejected', () => {
  const result = validateMetadata(baseValues({
    authorNames: ';;',
    affiliations: ',,',
  }), { mode: 'final' });
  expect(result.ok).toBe(false);
  expect(result.errors.authorNames).toBe('invalid_authors');
  expect(result.errors.affiliations).toBe('invalid_affiliations');
});

test('draft validation accepts empty optional fields', () => {
  const result = validateMetadata({
    authorNames: '',
    affiliations: '',
    contactEmail: '',
    abstract: '',
    keywords: '',
    mainSource: '',
  }, { mode: 'draft' });
  expect(result.ok).toBe(true);
});
