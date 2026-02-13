import { createFileUploadView } from '../../src/views/file-upload-view.js';
import { createFileUploadController } from '../../src/controllers/file-upload-controller.js';
import { submissionStorage } from '../../src/services/submission-storage.js';
import { uploadErrorLog } from '../../src/services/upload-error-log.js';
import { sessionState } from '../../src/models/session-state.js';

function setupAcceptance() {
  const view = createFileUploadView();
  document.body.appendChild(view.element);
  const controller = createFileUploadController({
    view,
    storage: submissionStorage,
    sessionState,
    errorLogger: uploadErrorLog,
  });
  controller.init();
  return { view, controller };
}

function setFiles(view, files) {
  const input = view.element.querySelector('#manuscriptFile');
  Object.defineProperty(input, 'files', {
    value: files,
    writable: false,
    configurable: true,
  });
}

function submit(view) {
  const event = new Event('submit', { bubbles: true, cancelable: true });
  view.element.querySelector('form').dispatchEvent(event);
}

function makeFile(name, size = 1024) {
  return new File(['content'], name, { type: 'application/pdf', lastModified: Date.now(), size });
}

test('unauthenticated access is blocked', () => {
  const { controller, view } = setupAcceptance();
  expect(controller.requireAuth()).toBe(false);
  expect(view.element.querySelector('#upload-status').textContent).toContain('log in');
});

test('unauthenticated submit shows access denied', () => {
  const { view } = setupAcceptance();
  setFiles(view, [makeFile('valid.pdf')]);
  submit(view);
  expect(view.element.querySelector('#upload-status').textContent).toContain('log in');
});

test('existing attachment loads on init', () => {
  sessionState.authenticate({ id: 'acct_init', email: 'init@example.com', createdAt: new Date().toISOString() });
  submissionStorage.saveManuscriptFile({
    id: 'file_init',
    originalName: 'init.pdf',
    fileType: 'pdf',
    fileSizeBytes: 1024,
    uploadedAt: new Date().toISOString(),
  });
  submissionStorage.attachFile('init@example.com', 'file_init');
  const { view } = setupAcceptance();
  expect(view.element.querySelector('#attachment-status').textContent).toContain('init.pdf');
});

test('authenticated access passes requireAuth', () => {
  sessionState.authenticate({ id: 'acct_auth', email: 'auth@example.com', createdAt: new Date().toISOString() });
  const { controller } = setupAcceptance();
  expect(controller.requireAuth()).toBe(true);
});

test('valid PDF upload succeeds and attaches file', () => {
  sessionState.authenticate({ id: 'acct_1', email: 'author@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  const file = makeFile('valid.pdf');
  setFiles(view, [file]);
  submit(view);
  const attachment = submissionStorage.getAttachment('author@example.com');
  expect(attachment).toBeTruthy();
  expect(attachment.file.originalName).toBe('valid.pdf');
});

test('missing file shows required error', () => {
  sessionState.authenticate({ id: 'acct_req', email: 'req@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  setFiles(view, []);
  submit(view);
  expect(view.element.querySelector('#manuscriptFile-error').textContent).toContain('required');
});

test('valid Word upload succeeds', () => {
  sessionState.authenticate({ id: 'acct_2', email: 'word@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  const file = makeFile('valid.docx');
  setFiles(view, [file]);
  submit(view);
  const attachment = submissionStorage.getAttachment('word@example.com');
  expect(attachment.file.fileType).toBe('docx');
});

test('valid LaTeX upload succeeds', () => {
  sessionState.authenticate({ id: 'acct_3', email: 'latex@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  const file = makeFile('valid.tex');
  setFiles(view, [file]);
  submit(view);
  const attachment = submissionStorage.getAttachment('latex@example.com');
  expect(attachment.file.fileType).toBe('tex');
});

test('invalid file type is rejected with formats error', () => {
  sessionState.authenticate({ id: 'acct_4', email: 'bad@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  const file = makeFile('invalid.txt');
  setFiles(view, [file]);
  view.element.querySelector('#manuscriptFile').dispatchEvent(new Event('change'));
  submit(view);
  expect(view.element.querySelector('#manuscriptFile-error').textContent).toContain('Accepted formats');
  expect(submissionStorage.getAttachment('bad@example.com')).toBeNull();
});

test('oversize file is rejected', () => {
  sessionState.authenticate({ id: 'acct_5', email: 'big@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  const file = new File([new Uint8Array(7 * 1024 * 1024 + 1)], 'oversize.pdf', { type: 'application/pdf' });
  setFiles(view, [file]);
  submit(view);
  expect(view.element.querySelector('#manuscriptFile-error').textContent).toContain('7MB');
  expect(submissionStorage.getAttachment('big@example.com')).toBeNull();
});

test('upload failure allows retry without duplicates', () => {
  sessionState.authenticate({ id: 'acct_6', email: 'retry@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  const file = makeFile('retry.pdf');
  file.failUpload = true;
  setFiles(view, [file]);
  submit(view);
  expect(view.element.querySelector('#manuscriptFile-error').textContent).toContain('Upload failed');
  file.failUpload = false;
  setFiles(view, [file]);
  submit(view);
  const attachment = submissionStorage.getAttachment('retry@example.com');
  expect(attachment).toBeTruthy();
  expect(Object.keys(submissionStorage.getAllFiles())).toHaveLength(1);
});

test('storage failure shows error and logs failure', () => {
  sessionState.authenticate({ id: 'acct_7', email: 'store@example.com', createdAt: new Date().toISOString() });
  submissionStorage.setFailureMode(true);
  const { view } = setupAcceptance();
  const file = makeFile('store.pdf');
  setFiles(view, [file]);
  submit(view);
  expect(view.element.querySelector('#upload-status').textContent).toContain('unavailable');
  expect(uploadErrorLog.getFailures().length).toBe(1);
  expect(submissionStorage.getAttachment('store@example.com')).toBeNull();
  submissionStorage.setFailureMode(false);
});

test('cancel selection leaves attachment unchanged', () => {
  sessionState.authenticate({ id: 'acct_8', email: 'cancel@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  const file = makeFile('keep.pdf');
  setFiles(view, [file]);
  submit(view);
  const attachment = submissionStorage.getAttachment('cancel@example.com');
  expect(attachment.file.originalName).toBe('keep.pdf');
  setFiles(view, []);
  view.element.querySelector('#manuscriptFile').dispatchEvent(new Event('change'));
  const after = submissionStorage.getAttachment('cancel@example.com');
  expect(after.file.originalName).toBe('keep.pdf');
});

test('replacement updates attachment', () => {
  sessionState.authenticate({ id: 'acct_9', email: 'replace@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  setFiles(view, [makeFile('first.pdf')]);
  submit(view);
  setFiles(view, [makeFile('second.pdf')]);
  submit(view);
  const attachment = submissionStorage.getAttachment('replace@example.com');
  expect(attachment.file.originalName).toBe('second.pdf');
});

test('multi-file selection is rejected', () => {
  sessionState.authenticate({ id: 'acct_10', email: 'multi@example.com', createdAt: new Date().toISOString() });
  const { view } = setupAcceptance();
  setFiles(view, [makeFile('one.pdf'), makeFile('two.pdf')]);
  view.element.querySelector('#manuscriptFile').dispatchEvent(new Event('change'));
  submit(view);
  expect(view.element.querySelector('#manuscriptFile-error').textContent).toContain('single file');
  expect(submissionStorage.getAttachment('multi@example.com')).toBeNull();
});
