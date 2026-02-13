import { createFileUploadView } from '../../src/views/file-upload-view.js';
import { createFileUploadController } from '../../src/controllers/file-upload-controller.js';
import { submissionStorage } from '../../src/services/submission-storage.js';
import { uploadErrorLog } from '../../src/services/upload-error-log.js';
import { sessionState } from '../../src/models/session-state.js';

function setupIntegration() {
  const view = createFileUploadView();
  document.body.appendChild(view.element);
  const controller = createFileUploadController({
    view,
    storage: submissionStorage,
    sessionState,
    errorLogger: uploadErrorLog,
  });
  controller.init();
  return { view };
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

test('successful upload attaches file', () => {
  submissionStorage.reset();
  sessionState.authenticate({ id: 'acct_20', email: 'author@example.com', createdAt: new Date().toISOString() });
  const { view } = setupIntegration();
  const file = makeFile('paper.pdf');
  setFiles(view, [file]);
  submit(view);
  const attachment = submissionStorage.getAttachment('author@example.com');
  expect(attachment).toBeTruthy();
  expect(attachment.file.originalName).toBe('paper.pdf');
});

test('replacement behavior overwrites attachment', () => {
  submissionStorage.reset();
  sessionState.authenticate({ id: 'acct_21', email: 'replace@example.com', createdAt: new Date().toISOString() });
  const { view } = setupIntegration();
  setFiles(view, [makeFile('old.pdf')]);
  submit(view);
  const first = submissionStorage.getAttachment('replace@example.com');
  setFiles(view, [makeFile('new.pdf')]);
  submit(view);
  const second = submissionStorage.getAttachment('replace@example.com');
  expect(second.manuscriptFileId).not.toBe(first.manuscriptFileId);
  expect(submissionStorage.getManuscriptFile(first.manuscriptFileId)).toBeNull();
});

test('validation responds within performance target', () => {
  submissionStorage.reset();
  sessionState.authenticate({ id: 'acct_22', email: 'perf@example.com', createdAt: new Date().toISOString() });
  const { view } = setupIntegration();
  setFiles(view, [makeFile('fast.pdf')]);
  const start = performance.now();
  submit(view);
  const duration = performance.now() - start;
  expect(duration).toBeLessThan(200);
});
