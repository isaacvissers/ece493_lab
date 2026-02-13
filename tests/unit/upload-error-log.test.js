import { uploadErrorLog } from '../../src/services/upload-error-log.js';

test('records and clears upload failures', () => {
  uploadErrorLog.clear();
  uploadErrorLog.logFailure({ errorType: 'upload', message: 'failed', context: 'sub_1' });
  const entries = uploadErrorLog.getFailures();
  expect(entries.length).toBe(1);
  expect(entries[0].errorType).toBe('upload');
  uploadErrorLog.clear();
  expect(uploadErrorLog.getFailures().length).toBe(0);
});
