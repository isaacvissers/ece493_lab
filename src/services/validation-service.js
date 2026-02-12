const EMAIL_AT_REGEX = /@/g;
const LOCAL_PART_ALLOWED_REGEX = /^[A-Za-z0-9._+-]+$/;
const PASSWORD_NUMBER_REGEX = /\d/;
const PASSWORD_SYMBOL_REGEX = /[^A-Za-z0-9]/;
const PASSWORD_DISALLOWED_REGEX = /[\s\x00-\x1F\x7F]/;

const PASSWORD_LOG_KEY = 'cms.password_validation_log';

let policyAvailable = true;

function hasSingleAt(email) {
  const matches = email.match(EMAIL_AT_REGEX);
  return matches && matches.length === 1;
}

function hasDomainDot(domain) {
  const dotIndex = domain.indexOf('.');
  return dotIndex > 0 && dotIndex < domain.length - 1;
}

function loadLog() {
  const raw = localStorage.getItem(PASSWORD_LOG_KEY);
  return raw ? JSON.parse(raw) : [];
}

export const validationService = {
  normalizeEmail(email) {
    return (email || '').trim();
  },

  setPolicyAvailable(enabled) {
    policyAvailable = Boolean(enabled);
  },

  getPasswordPolicy() {
    if (!policyAvailable) {
      throw new Error('policy_unavailable');
    }
    return {
      minLength: 8,
      requireNumber: true,
      requireSymbol: true,
    };
  },

  logPasswordFailure(type, userId) {
    const log = loadLog();
    log.push({
      type,
      userId: userId || null,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(PASSWORD_LOG_KEY, JSON.stringify(log));
  },

  isEmailValid(rawEmail) {
    const email = validationService.normalizeEmail(rawEmail);
    if (!email || !hasSingleAt(email)) {
      return false;
    }
    const [local, domain] = email.split('@');
    if (!local || !domain) {
      return false;
    }
    if (!LOCAL_PART_ALLOWED_REGEX.test(local)) {
      return false;
    }
    return hasDomainDot(domain);
  },

  isPasswordValid(password) {
    const trimmed = (password || '').trim();
    if (!trimmed) {
      return { ok: false, reason: 'too_short' };
    }
    if (PASSWORD_DISALLOWED_REGEX.test(trimmed)) {
      return { ok: false, reason: 'disallowed' };
    }
    if (trimmed.length < 8) {
      return { ok: false, reason: 'too_short' };
    }
    if (!PASSWORD_NUMBER_REGEX.test(trimmed) || !PASSWORD_SYMBOL_REGEX.test(trimmed)) {
      return { ok: false, reason: 'complexity' };
    }
    return { ok: true };
  },
};
