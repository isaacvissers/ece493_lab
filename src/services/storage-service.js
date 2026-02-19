const ACCOUNTS_KEY = 'cms.accounts';
const SESSION_KEY = 'cms.session';
const VALIDATION_LOG_KEY = 'cms.validation_failures';

let failureMode = false;
let cachedAccounts = null;
let cachedSession = null;

function normalizeEmail(email) {
  return (email || '').trim().toLowerCase();
}

function loadAccounts() {
  if (cachedAccounts) {
    return cachedAccounts;
  }
  const raw = localStorage.getItem(ACCOUNTS_KEY);
  cachedAccounts = raw ? JSON.parse(raw) : [];
  return cachedAccounts;
}

function persistAccounts(accounts) {
  if (failureMode) {
    throw new Error('storage_failure');
  }
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  cachedAccounts = accounts;
}

function loadSession() {
  if (cachedSession) {
    return cachedSession;
  }
  const raw = localStorage.getItem(SESSION_KEY);
  cachedSession = raw ? JSON.parse(raw) : null;
  return cachedSession;
}

function persistSession(session) {
  if (failureMode) {
    throw new Error('storage_failure');
  }
  if (!session) {
    localStorage.removeItem(SESSION_KEY);
    cachedSession = null;
    return;
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  cachedSession = session;
}

function loadValidationLog() {
  const raw = localStorage.getItem(VALIDATION_LOG_KEY);
  return raw ? JSON.parse(raw) : [];
}

export const storageService = {
  setFailureMode(enabled) {
    failureMode = Boolean(enabled);
  },
  reset() {
    failureMode = false;
    cachedAccounts = null;
    cachedSession = null;
    localStorage.removeItem(ACCOUNTS_KEY);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(VALIDATION_LOG_KEY);
  },

  getAccounts() {
    return loadAccounts().slice();
  },

  findByEmail(email) {
    const normalized = normalizeEmail(email);
    return loadAccounts().find((account) => account.normalizedEmail === normalized) || null;
  },

  findById(accountId) {
    return loadAccounts().find((account) => account.id === accountId) || null;
  },

  saveAccount(account) {
    const accounts = loadAccounts().slice();
    accounts.push(account);
    persistAccounts(accounts);
  },

  ensureAccount(account) {
    const normalized = normalizeEmail(account && account.email);
    if (!normalized) {
      return null;
    }
    const existingIndex = loadAccounts().findIndex((entry) => entry.normalizedEmail === normalized);
    if (existingIndex !== -1) {
      const existing = loadAccounts()[existingIndex];
      const updated = {
        ...existing,
        ...account,
        id: existing.id,
        createdAt: existing.createdAt,
        normalizedEmail: normalized,
      };
      const accounts = loadAccounts().slice();
      accounts[existingIndex] = updated;
      persistAccounts(accounts);
      return updated;
    }
    const next = {
      ...account,
      normalizedEmail: normalized,
    };
    const accounts = loadAccounts().slice();
    accounts.push(next);
    persistAccounts(accounts);
    return next;
  },

  updateAccount(updatedAccount) {
    const accounts = loadAccounts().slice();
    const index = accounts.findIndex((account) => account.id === updatedAccount.id);
    if (index === -1) {
      return null;
    }
    accounts[index] = updatedAccount;
    persistAccounts(accounts);
    return updatedAccount;
  },

  logValidationFailure(details) {
    const log = loadValidationLog();
    log.push({
      ...details,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(VALIDATION_LOG_KEY, JSON.stringify(log));
  },

  setCurrentUser(account) {
    if (!account) {
      persistSession(null);
      return;
    }
    const session = {
      id: account.id,
      email: account.email,
      createdAt: account.createdAt,
      role: account.role || null,
    };
    persistSession(session);
  },

  getCurrentUser() {
    return loadSession();
  },

  clearCurrentUser() {
    persistSession(null);
  },

  normalizeEmail,
};
