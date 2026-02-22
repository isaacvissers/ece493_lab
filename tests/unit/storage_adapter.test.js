import { createStorageAdapter } from '../../src/services/storage_adapter.js';

describe('storage adapter', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('reads and writes with cache', () => {
    const adapter = createStorageAdapter({ cache: new Map() });
    const fallback = adapter.read('key', []);
    expect(fallback).toEqual([]);
    adapter.write('key', { value: 1 });
    const cached = adapter.read('key', null);
    expect(cached.value).toBe(1);
  });

  test('removes and clears cache', () => {
    const cache = new Map();
    const adapter = createStorageAdapter({ cache });
    adapter.write('key', { value: 2 });
    adapter.remove('key');
    expect(localStorage.getItem('key')).toBe(null);
    cache.set('another', 3);
    adapter.clearAll();
    expect(cache.size).toBe(0);
  });

  test('falls back on invalid JSON', () => {
    const adapter = createStorageAdapter({ cache: new Map() });
    localStorage.setItem('bad', '{not json');
    const value = adapter.read('bad', { ok: false });
    expect(value).toEqual({ ok: false });
  });
});
