import { submissionStorage } from '../../src/services/submission-storage.js';

test('saves and loads manuscripts', () => {
  submissionStorage.reset();
  expect(submissionStorage.getManuscripts()).toEqual([]);
  submissionStorage.saveSubmission({ id: 'ms_1', title: 'Paper' });
  const manuscripts = submissionStorage.getManuscripts();
  expect(manuscripts.length).toBe(1);
  expect(manuscripts[0].title).toBe('Paper');
  const cached = submissionStorage.getManuscripts();
  expect(cached.length).toBe(1);
});

test('saves, loads, and clears drafts', () => {
  submissionStorage.reset();
  expect(submissionStorage.loadDraft('user@example.com')).toBe(null);
  expect(submissionStorage.loadDraft('user@example.com')).toBe(null);
  const draft = { id: 'draft_1', draftData: { title: 'Draft' } };
  submissionStorage.saveDraft('user@example.com', draft);
  expect(submissionStorage.loadDraft('user@example.com').id).toBe('draft_1');
  expect(submissionStorage.loadDraft('user@example.com').id).toBe('draft_1');
  submissionStorage.clearDraft('user@example.com');
  expect(submissionStorage.loadDraft('user@example.com')).toBe(null);
  submissionStorage.clearDraft('missing@example.com');
  expect(submissionStorage.loadDraft('missing@example.com')).toBe(null);
});

test('throws when failure mode enabled', () => {
  submissionStorage.reset();
  submissionStorage.setFailureMode(true);
  expect(() => submissionStorage.saveSubmission({ id: 'ms_fail' }))
    .toThrow('storage_failure');
  expect(() => submissionStorage.saveDraft('user@example.com', { id: 'draft_fail' }))
    .toThrow('storage_failure');
  expect(() => submissionStorage.saveManuscriptFile({
    id: 'file_fail',
    originalName: 'bad.pdf',
    fileType: 'pdf',
    fileSizeBytes: 10,
    uploadedAt: new Date().toISOString(),
  })).toThrow('storage_failure');
  expect(() => submissionStorage.attachFile('user@example.com', 'file_fail'))
    .toThrow('storage_failure');
  submissionStorage.setFailureMode(false);
});

test('returns cached manuscripts without touching storage', () => {
  submissionStorage.reset();
  submissionStorage.getManuscripts();
  const cached = submissionStorage.getManuscripts();
  expect(Array.isArray(cached)).toBe(true);
});

test('loads manuscripts from persisted storage when cache is empty', () => {
  submissionStorage.reset();
  localStorage.setItem('cms.manuscripts', JSON.stringify([{ id: 'ms_2', title: 'Stored' }]));
  const manuscripts = submissionStorage.getManuscripts();
  expect(manuscripts).toHaveLength(1);
  expect(manuscripts[0].id).toBe('ms_2');
});

test('loads drafts from persisted storage when cache is empty', () => {
  submissionStorage.reset();
  localStorage.setItem('cms.submission_drafts', JSON.stringify({
    'user@example.com': { id: 'draft_2', draftData: { title: 'Stored Draft' } },
  }));
  const draft = submissionStorage.loadDraft('user@example.com');
  expect(draft).not.toBeNull();
  expect(draft.id).toBe('draft_2');
});

test('stores and retrieves manuscript files and attachments', () => {
  submissionStorage.reset();
  const fileRecord = {
    id: 'file_1',
    originalName: 'paper.pdf',
    fileType: 'pdf',
    fileSizeBytes: 1000,
    uploadedAt: new Date().toISOString(),
  };
  submissionStorage.saveManuscriptFile(fileRecord);
  submissionStorage.attachFile('user@example.com', fileRecord.id);
  const attachment = submissionStorage.getAttachment('user@example.com');
  expect(attachment).toBeTruthy();
  expect(attachment.manuscriptFileId).toBe('file_1');
  expect(attachment.file.originalName).toBe('paper.pdf');
});

test('removes manuscript files and clears attachments', () => {
  submissionStorage.reset();
  const fileRecord = {
    id: 'file_2',
    originalName: 'paper2.pdf',
    fileType: 'pdf',
    fileSizeBytes: 1200,
    uploadedAt: new Date().toISOString(),
  };
  submissionStorage.saveManuscriptFile(fileRecord);
  submissionStorage.attachFile('user2@example.com', fileRecord.id);
  submissionStorage.removeManuscriptFile(fileRecord.id);
  expect(submissionStorage.getManuscriptFile(fileRecord.id)).toBeNull();
  submissionStorage.clearAttachment('user2@example.com');
  expect(submissionStorage.getAttachment('user2@example.com')).toBeNull();
});

test('loads attachments and files from persisted storage when cache is empty', () => {
  submissionStorage.reset();
  localStorage.setItem('cms.manuscript_files', JSON.stringify({
    file_3: {
      id: 'file_3',
      originalName: 'stored.pdf',
      fileType: 'pdf',
      fileSizeBytes: 2048,
      uploadedAt: new Date().toISOString(),
    },
  }));
  localStorage.setItem('cms.submission_attachments', JSON.stringify({
    'user3@example.com': {
      manuscriptFileId: 'file_3',
      attachedAt: new Date().toISOString(),
    },
  }));
  const attachment = submissionStorage.getAttachment('user3@example.com');
  expect(attachment).toBeTruthy();
  expect(attachment.file.originalName).toBe('stored.pdf');
});

test('handles missing attachments and files gracefully', () => {
  submissionStorage.reset();
  expect(submissionStorage.getAttachment('missing@example.com')).toBeNull();
  submissionStorage.clearAttachment('missing@example.com');
  submissionStorage.removeManuscriptFile('missing_file');
  expect(Object.keys(submissionStorage.getAllFiles())).toHaveLength(0);
});

test('returns attachment with null file when file record missing', () => {
  submissionStorage.reset();
  localStorage.setItem('cms.submission_attachments', JSON.stringify({
    'ghost@example.com': {
      manuscriptFileId: 'file_missing',
      attachedAt: new Date().toISOString(),
    },
  }));
  const attachment = submissionStorage.getAttachment('ghost@example.com');
  expect(attachment).toBeTruthy();
  expect(attachment.file).toBeNull();
});
