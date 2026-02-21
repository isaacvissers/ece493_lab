import { createRegistrationView } from '../../src/views/registration_view.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('registration view includes accessibility attributes', () => {
  const view = createRegistrationView();
  document.body.appendChild(view.element);
  const status = view.element.querySelector('#registration-status');
  expect(status.getAttribute('aria-live')).toBe('polite');
});
