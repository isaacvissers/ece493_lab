import { reviewStorageService } from '../../src/services/review-storage-service.js';

beforeEach(() => {
  reviewStorageService.reset();
});

test('throws when storage failure mode enabled', () => {
  reviewStorageService.setFailureMode(true);
  expect(() => {
    reviewStorageService.saveDraft({ formId: 'form_1', reviewerEmail: 'rev@example.com', content: {} });
  }).toThrow('review_storage_failure');
});
