import { storageService } from '../src/services/storage-service.js';
import { loginLogging } from '../src/services/login-logging.js';
import { redirectLogging } from '../src/services/redirect-logging.js';
import { validationService } from '../src/services/validation-service.js';

beforeEach(() => {
  document.body.innerHTML = '';
  if (typeof localStorage !== 'undefined') {
    localStorage.clear();
  }
  storageService.reset();
  loginLogging.clear();
  redirectLogging.clear();
  validationService.setPolicyAvailable(true);
});
