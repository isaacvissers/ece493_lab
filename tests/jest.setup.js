import { storageService } from '../src/services/storage-service.js';
import { loginLogging } from '../src/services/login-logging.js';

beforeEach(() => {
  document.body.innerHTML = '';
  if (typeof localStorage !== 'undefined') {
    localStorage.clear();
  }
  storageService.reset();
  loginLogging.clear();
});
