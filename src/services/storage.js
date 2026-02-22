const cache = new Map();

function read(key, fallback) {
  if (cache.has(key)) {
    return cache.get(key);
  }
  const raw = localStorage.getItem(key);
  const value = raw ? JSON.parse(raw) : fallback;
  cache.set(key, value);
  return value;
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  cache.set(key, value);
}

function remove(key) {
  localStorage.removeItem(key);
  cache.delete(key);
}

function clearAll() {
  cache.clear();
}

export const decisionStorage = {
  read,
  write,
  remove,
  clearAll,
};

export const scheduleStorage = {
  read,
  write,
  remove,
  clearAll,
};

export const registrationStorage = {
  read,
  write,
  remove,
  clearAll,
};

export const paymentStorage = {
  read,
  write,
  remove,
  clearAll,
};

export const priceListStorage = {
  read,
  write,
  remove,
  clearAll,
};

export const confirmationStorage = {
  read,
  write,
  remove,
  clearAll,
};
