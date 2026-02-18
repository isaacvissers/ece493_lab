import { storageService } from '../src/services/storage-service.js';
import { loginLogging } from '../src/services/login-logging.js';
import { redirectLogging } from '../src/services/redirect-logging.js';
import { validationService } from '../src/services/validation-service.js';
import { passwordErrorLogging } from '../src/services/password-error-logging.js';
import { submissionStorage } from '../src/services/submission-storage.js';
import { submissionErrorLog } from '../src/services/submission-error-log.js';
import { uploadErrorLog } from '../src/services/upload-error-log.js';
import { metadataStorage } from '../src/services/metadata-storage.js';
import { metadataErrorLog } from '../src/services/metadata-error-log.js';
import { assignmentStore } from '../src/services/assignment-store.js';
import { reviewRequestStore } from '../src/services/review-request-store.js';
import { violationLog } from '../src/services/violation-log.js';
import { reviewRequestService } from '../src/services/review-request-service.js';

beforeEach(() => {
  document.body.innerHTML = '';
  if (typeof localStorage !== 'undefined') {
    localStorage.clear();
  }
  storageService.reset();
  loginLogging.clear();
  redirectLogging.clear();
  passwordErrorLogging.clear();
  submissionStorage.reset();
  submissionErrorLog.clear();
  uploadErrorLog.clear();
  metadataStorage.reset();
  metadataErrorLog.clear();
  assignmentStore.reset();
  reviewRequestStore.reset();
  reviewRequestService.setDeliveryFailureMode(false);
  violationLog.clear();
  validationService.setPolicyAvailable(true);
});
