import { registrationWindowService } from '../../src/services/registration_window_service.js';

beforeEach(() => {
  registrationWindowService.reset();
});

test('defaults to closed when window missing', () => {
  const window = registrationWindowService.getWindow();
  expect(window.isOpen).toBe(false);
});

test('detects open window based on timestamps', () => {
  const startAt = '2026-03-01T00:00:00.000Z';
  const endAt = '2026-03-10T00:00:00.000Z';
  registrationWindowService.setWindow({ startAt, endAt });
  const now = Date.parse('2026-03-05T12:00:00.000Z');
  const window = registrationWindowService.getWindow(now);
  expect(window.isOpen).toBe(true);
});

test('returns closed when timestamps invalid', () => {
  registrationWindowService.setWindow({ startAt: 'invalid', endAt: 'invalid' });
  expect(registrationWindowService.isOpen()).toBe(false);
});

test('stores default window values when setWindow called without args', () => {
  const window = registrationWindowService.setWindow();
  expect(window.startAt).toBeNull();
  expect(window.endAt).toBeNull();
  expect(window.isOpen).toBe(false);
});

test('returns closed when now outside the window range', () => {
  const startAt = '2026-03-01T00:00:00.000Z';
  const endAt = '2026-03-10T00:00:00.000Z';
  registrationWindowService.setWindow({ startAt, endAt });
  const now = Date.parse('2026-02-01T00:00:00.000Z');
  const window = registrationWindowService.getWindow(now);
  expect(window.isOpen).toBe(false);
});
