import { validationService } from '../services/validation-service.js';
import { storageService } from '../services/storage-service.js';

function generateId() {
  return `acct_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createUserAccount({ email, password }) {
  const normalizedEmail = storageService.normalizeEmail(email);
  if (!validationService.isEmailValid(normalizedEmail)) {
    throw new Error('email_invalid');
  }
  const passwordResult = validationService.isPasswordValid(password);
  if (!passwordResult.ok) {
    throw new Error('password_invalid');
  }
  return {
    id: generateId(),
    email: normalizedEmail,
    normalizedEmail,
    password,
    createdAt: new Date().toISOString(),
  };
}

export function findAccountByCredentials({ email, password }, storage) {
  const normalizedEmail = storage.normalizeEmail(email);
  const account = storage.findByEmail(normalizedEmail);
  if (!account) {
    return null;
  }
  if (account.password !== password) {
    return null;
  }
  return account;
}

export function updateAccountPassword({ accountId, newPassword }, storage) {
  const account = storage.findById(accountId);
  if (!account) {
    return null;
  }
  const updated = {
    ...account,
    password: newPassword,
  };
  return storage.updateAccount(updated);
}
