import { jest } from '@jest/globals';
import { createLoginView } from '../../src/views/login-view.js';
import { createRegistrationView } from '../../src/views/registration-view.js';
import { createDashboardView } from '../../src/views/dashboard-view.js';
import { createAccountSettingsView } from '../../src/views/account-settings-view.js';
import { createSubmitManuscriptView } from '../../src/views/submit-manuscript-view.js';
import { createFileUploadView } from '../../src/views/file-upload-view.js';

test('login view exposes fields and status helpers', () => {
  const view = createLoginView();
  document.body.appendChild(view.element);
  expect(view.element.querySelector('#login-email')).toBeTruthy();
  expect(view.element.querySelector('#login-password')).toBeTruthy();

  view.setStatus('ok', false);
  const status = view.element.querySelector('.status');
  expect(status.textContent).toBe('ok');

  view.setFieldError('email', 'Email is required.', 'Enter an email.');
  expect(view.element.querySelector('#login-email-error').textContent)
    .toContain('Email is required.');

  view.showAccessDenied('Access denied');
  expect(view.element.querySelector('.status').textContent).toContain('Access denied');

  const registerButton = view.element.querySelector('#register-button');
  expect(registerButton).toBeTruthy();
  const onRegister = jest.fn();
  view.onRegister(onRegister);
  registerButton.click();
  expect(onRegister).toHaveBeenCalled();

  view.clearErrors();
  expect(view.element.querySelector('#login-email-error').textContent).toBe('');
});

test('registration view exposes fields and helpers', () => {
  const view = createRegistrationView();
  document.body.appendChild(view.element);
  expect(view.element.querySelector('#email')).toBeTruthy();
  expect(view.element.querySelector('#password')).toBeTruthy();

  view.setStatus('registered', true);
  const status = view.element.querySelector('.status');
  expect(status.textContent).toBe('registered');
  expect(status.className).toContain('success');
  view.clearErrors();
  expect(view.element.querySelector('.status').textContent).toBe('');

  const loginButton = view.element.querySelector('#login-button');
  expect(loginButton).toBeTruthy();
  const onLogin = jest.fn();
  view.onLogin(onLogin);
  loginButton.click();
  expect(onLogin).toHaveBeenCalled();
});

test('dashboard view includes email when provided', () => {
  const view = createDashboardView({ email: 'user@example.com' });
  document.body.appendChild(view.element);
  expect(view.element.querySelector('.helper').textContent).toContain('user@example.com');
  const changeButton = view.element.querySelector('#change-password-button');
  expect(changeButton).toBeTruthy();
  const onChange = jest.fn();
  view.onChangePassword(onChange);
  changeButton.click();
  expect(onChange).toHaveBeenCalled();
  const submitButton = view.element.querySelector('#submit-paper-button');
  expect(submitButton).toBeTruthy();
  const onSubmit = jest.fn();
  view.onSubmitPaper(onSubmit);
  submitButton.click();
  expect(onSubmit).toHaveBeenCalled();
  const uploadButton = view.element.querySelector('#upload-manuscript-button');
  expect(uploadButton).toBeTruthy();
  const onUpload = jest.fn();
  view.onUploadManuscript(onUpload);
  uploadButton.click();
  expect(onUpload).toHaveBeenCalled();
});

test('dashboard view handles missing user', () => {
  const view = createDashboardView(null);
  document.body.appendChild(view.element);
  expect(view.element.querySelector('.helper').textContent).toContain('Signed in.');
});

test('account settings view exposes fields and helpers', () => {
  const view = createAccountSettingsView();
  document.body.appendChild(view.element);
  expect(view.element.querySelector('#current-password')).toBeTruthy();
  expect(view.element.querySelector('#new-password')).toBeTruthy();
  expect(view.element.querySelector('#confirm-password')).toBeTruthy();

  view.setStatus('updated', false);
  const status = view.element.querySelector('.status');
  expect(status.textContent).toBe('updated');

  view.setFieldError('currentPassword', 'Current error', 'Try again.');
  expect(view.element.querySelector('#current-password-error').textContent).toContain('Current error');

  view.focusField('newPassword');
  expect(document.activeElement).toBe(view.element.querySelector('#new-password'));
  view.focusField('confirmPassword');
  expect(document.activeElement).toBe(view.element.querySelector('#confirm-password'));
  view.focusField('currentPassword');
  expect(document.activeElement).toBe(view.element.querySelector('#current-password'));

  const backButton = view.element.querySelector('#dashboard-button');
  expect(backButton).toBeTruthy();
  const onBack = jest.fn();
  view.onBack(onBack);
  backButton.click();
  expect(onBack).toHaveBeenCalled();
});

test('submit manuscript view exposes fields and helpers', () => {
  const view = createSubmitManuscriptView();
  document.body.appendChild(view.element);
  expect(view.element.querySelector('#title')).toBeTruthy();
  expect(view.element.querySelector('#authorNames')).toBeTruthy();
  expect(view.element.querySelector('#contactEmail')).toBeTruthy();
  expect(view.element.querySelector('#manuscriptFile')).toBeTruthy();
  const onSave = jest.fn();
  view.onSaveDraft(onSave);
  view.element.querySelector('#save-draft').click();
  expect(onSave).toHaveBeenCalled();
  view.setFieldError('unknown', 'Oops', 'Recover');
  expect(view.element.querySelector('#title-error').textContent).toBe('');
  view.focusField('title');
  expect(document.activeElement).toBe(view.element.querySelector('#title'));
  view.focusField('unknown');
  expect(view.getFile()).toBe(null);
  view.setValues({});
  expect(view.element.querySelector('#title').value).toBe('');
});

test('file upload view exposes fields and helpers', () => {
  const view = createFileUploadView();
  document.body.appendChild(view.element);
  expect(view.element.querySelector('#manuscriptFile')).toBeTruthy();
  view.setFieldError('unknown', 'Oops', 'Recover');
  expect(view.element.querySelector('#manuscriptFile-error').textContent).toBe('');
  view.focusField('manuscriptFile');
  expect(document.activeElement).toBe(view.element.querySelector('#manuscriptFile'));
  view.setAttachment(null);
  expect(view.element.querySelector('#attachment-status').textContent).toContain('No file attached');
  const file = new File(['content'], 'paper.pdf', { type: 'application/pdf', size: 100 });
  view.setAttachment({ originalName: file.name, fileType: 'pdf', fileSizeBytes: file.size });
  expect(view.element.querySelector('#attachment-status').textContent).toContain('paper.pdf');
  const onSubmit = jest.fn();
  view.onSubmit(onSubmit);
  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  expect(onSubmit).toHaveBeenCalled();
  const onChange = jest.fn();
  view.onFileChange(onChange);
  view.element.querySelector('#manuscriptFile').dispatchEvent(new Event('change'));
  expect(onChange).toHaveBeenCalled();
  view.focusField('unknown');
  const input = view.element.querySelector('#manuscriptFile');
  Object.defineProperty(input, 'files', { value: null, configurable: true });
  expect(view.getFiles()).toEqual([]);
});
