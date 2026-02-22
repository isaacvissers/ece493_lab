const defaultCache = new Map();

function safeParse(value, fallback) {
  if (value === null || value === undefined) {
    return fallback;
  }
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

export function createStorageAdapter({ storage = localStorage, cache = defaultCache } = {}) {
  return {
    read(key, fallback) {
      if (cache.has(key)) {
        return cache.get(key);
      }
      const raw = storage.getItem(key);
      const value = safeParse(raw, fallback);
      cache.set(key, value);
      return value;
    },
    write(key, value) {
      storage.setItem(key, JSON.stringify(value));
      cache.set(key, value);
    },
    remove(key) {
      storage.removeItem(key);
      cache.delete(key);
    },
    clearAll() {
      cache.clear();
    },
  };
}
