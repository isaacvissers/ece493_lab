const FLAG_KEY = 'cms.admin_flags';
let cachedFlags = null;

function loadFlags() {
  if (cachedFlags) {
    return cachedFlags;
  }
  const raw = localStorage.getItem(FLAG_KEY);
  cachedFlags = raw ? JSON.parse(raw) : [];
  return cachedFlags;
}

function persistFlags(flags) {
  localStorage.setItem(FLAG_KEY, JSON.stringify(flags));
  cachedFlags = flags;
}

export const adminFlagService = {
  reset() {
    cachedFlags = null;
    localStorage.removeItem(FLAG_KEY);
  },
  addFlag({ reviewId, reason } = {}) {
    const flags = loadFlags().slice();
    flags.push({
      flagId: `flag_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`,
      reviewId,
      reason,
      createdAt: new Date().toISOString(),
      status: 'open',
    });
    persistFlags(flags);
  },
  getFlags() {
    return loadFlags().slice();
  },
  resolveFlag(flagId) {
    const flags = loadFlags().map((flag) => (
      flag.flagId === flagId ? { ...flag, status: 'resolved', resolvedAt: new Date().toISOString() } : flag
    ));
    persistFlags(flags);
  },
};
