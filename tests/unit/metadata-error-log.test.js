import { metadataErrorLog } from '../../src/services/metadata-error-log.js';

test('records and clears metadata failures', () => {
  metadataErrorLog.clear();
  metadataErrorLog.logFailure({ errorType: 'storage', message: 'fail', context: 'sub_1' });
  const entries = metadataErrorLog.getFailures();
  expect(entries.length).toBe(1);
  expect(entries[0].errorType).toBe('storage');
  metadataErrorLog.clear();
  expect(metadataErrorLog.getFailures().length).toBe(0);
});
