import { storageService } from '../src/services/storage-service.js';
import { loginLogging } from '../src/services/login-logging.js';
import { redirectLogging } from '../src/services/redirect-logging.js';
import { validationService } from '../src/services/validation-service.js';
import { passwordErrorLogging } from '../src/services/password-error-logging.js';
import { submissionStorage } from '../src/services/submission-storage.js';
import { submissionErrorLog } from '../src/services/submission-error-log.js';

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
  validationService.setPolicyAvailable(true);
});
