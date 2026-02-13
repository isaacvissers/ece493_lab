import { createManuscriptFile, manuscriptFileRules, validateManuscriptFile } from '../../src/models/manuscript-file.js';

function makeFile(name, size) {
  return new File([new Uint8Array(size)], name, { type: 'application/pdf', lastModified: Date.now() });
}

test('validates required file', () => {
  const validation = validateManuscriptFile(null);
  expect(validation.ok).toBe(false);
  expect(validation.error.code).toBe('file_required');
});

test('validates file extension and size', () => {
  const invalid = validateManuscriptFile(makeFile('paper.txt', 1000));
  expect(invalid.ok).toBe(false);
  expect(invalid.error.code).toBe('file_type_invalid');
  const missingExtension = validateManuscriptFile(makeFile('paper', 1000));
  expect(missingExtension.ok).toBe(false);
  expect(missingExtension.error.code).toBe('file_type_invalid');

  const oversize = validateManuscriptFile(makeFile('paper.pdf', manuscriptFileRules.maxSizeBytes + 1));
  expect(oversize.ok).toBe(false);
  expect(oversize.error.code).toBe('file_too_large');
});

test('accepts case-insensitive extensions', () => {
  const validation = validateManuscriptFile(makeFile('PAPER.PDF', 1024));
  expect(validation.ok).toBe(true);
});

test('createManuscriptFile builds metadata', () => {
  const file = makeFile('paper.docx', 2048);
  const record = createManuscriptFile(file);
  expect(record.originalName).toBe('paper.docx');
  expect(record.fileType).toBe('docx');
  expect(record.fileSizeBytes).toBe(2048);
  expect(record.id).toContain('file_');
});
