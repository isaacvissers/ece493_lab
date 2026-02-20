import { jest } from '@jest/globals';
import { createLoginView } from '../../src/views/login-view.js';
import { createRegistrationView } from '../../src/views/registration-view.js';
import { createDashboardView } from '../../src/views/dashboard-view.js';
import { createAccountSettingsView } from '../../src/views/account-settings-view.js';
import { createSubmitManuscriptView } from '../../src/views/submit-manuscript-view.js';
import { createMetadataFormView } from '../../src/views/metadata-form-view.js';
import { createSubmissionFormView } from '../../src/views/submission-form-view.js';
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

  const announcement = document.createElement('div');
  announcement.textContent = 'Announcement';
  view.setAnnouncement(announcement);
  expect(view.element.querySelector('#schedule-announcement-slot').textContent).toContain('Announcement');
  view.setAnnouncement(null);
  expect(view.element.querySelector('#schedule-announcement-slot').textContent).toBe('');
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
  const view = createDashboardView(
    { email: 'user@example.com' },
    [
      { title: 'Paper A', status: 'submitted' },
      { title: 'Paper B', status: 'approved' },
      { title: 'Paper C', status: 'in progress' },
      { title: '', status: null },
    ],
  );
  document.body.appendChild(view.element);
  expect(view.element.querySelector('.helper').textContent).toContain('user@example.com');
  const items = view.element.querySelectorAll('.submission-item');
  expect(items).toHaveLength(4);
  expect(items[0].textContent).toContain('Paper A');
  expect(items[0].textContent).toContain('Submitted');
  expect(items[1].textContent).toContain('Approved');
  expect(items[2].textContent).toContain('In Progress');
  expect(items[3].textContent).toContain('Untitled manuscript');
  expect(items[3].textContent).toContain('Submitted');
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
});

test('dashboard view handles missing user', () => {
  const view = createDashboardView(null, []);
  document.body.appendChild(view.element);
  expect(view.element.querySelector('.helper').textContent).toContain('Signed in.');
  expect(view.element.querySelector('.submission-list').textContent).toContain('No uploaded papers yet');
});

test('dashboard view defaults submissions list when omitted', () => {
  const view = createDashboardView({ email: 'default@example.com' });
  document.body.appendChild(view.element);
  expect(view.element.querySelector('.submission-list').textContent).toContain('No uploaded papers yet');
});

test('dashboard view lists assignable papers for editors', () => {
  const view = createDashboardView(
    { email: 'editor@example.com', role: 'Editor' },
    [],
    [{ id: 'paper_1', title: 'Paper One', status: 'submitted' }],
  );
  document.body.appendChild(view.element);
  const assignButton = view.element.querySelector('.assignment-item button');
  expect(assignButton).toBeTruthy();
  const onAssign = jest.fn();
  view.onAssignReferees(onAssign);
  assignButton.click();
  expect(onAssign).toHaveBeenCalledWith('paper_1');
});

test('dashboard view falls back to paper id when title missing', () => {
  const view = createDashboardView(
    { email: 'editor@example.com', role: 'Editor' },
    [],
    [{ id: 'paper_2', title: '', status: 'submitted' }],
  );
  document.body.appendChild(view.element);
  expect(view.element.querySelector('.assignment-item').textContent).toContain('Paper paper_2');
});

test('dashboard view shows empty assignment state for editors', () => {
  const view = createDashboardView(
    { email: 'editor@example.com', role: 'Editor' },
    [],
    [],
  );
  document.body.appendChild(view.element);
  expect(view.element.querySelector('.assignment-list').textContent).toContain('No papers awaiting reviewer assignment.');
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
  const onBack = jest.fn();
  view.onBack(onBack);
  view.element.querySelector('#back-to-dashboard').click();
  expect(onBack).toHaveBeenCalled();
  view.setFieldError('unknown', 'Oops', 'Recover');
  expect(view.element.querySelector('#title-error').textContent).toBe('');
  view.focusField('title');
  expect(document.activeElement).toBe(view.element.querySelector('#title'));
  view.focusField('unknown');
  expect(view.getFile()).toBe(null);
  view.setValues({});
  expect(view.element.querySelector('#title').value).toBe('');
  view.setDraftIndicator('Last saved at 10:00');
  expect(view.element.querySelector('#draft-indicator').textContent).toContain('Last saved at');
  view.setDraftIndicator('');
  expect(view.element.querySelector('#draft-indicator').textContent).toBe('');
  view.setDraftWarning('Draft saved with incomplete fields.');
  expect(view.element.querySelector('#draft-warning').textContent).toContain('incomplete');
  view.setDraftAttachment({ originalName: 'draft.pdf', fileType: 'pdf', fileSizeBytes: 100 });
  expect(view.element.querySelector('#draft-attachment-status').textContent).toContain('draft.pdf');
  view.setDraftAttachment(null);
  expect(view.element.querySelector('#draft-attachment-status').textContent).toContain('No file attached');
  view.setEditable(false);
  expect(view.element.querySelector('#title').disabled).toBe(true);
  view.setEditable(true);
  expect(view.element.querySelector('#title').disabled).toBe(false);
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

test('metadata form view exposes fields and helpers', () => {
  const view = createMetadataFormView();
  document.body.appendChild(view.element);
  expect(view.element.querySelector('#authorNames')).toBeTruthy();
  expect(view.element.querySelector('#affiliations')).toBeTruthy();
  expect(view.element.querySelector('#contactEmail')).toBeTruthy();
  expect(view.element.querySelector('#abstract')).toBeTruthy();
  expect(view.element.querySelector('#keywords')).toBeTruthy();
  expect(view.element.querySelector('#mainSource')).toBeTruthy();
  view.setFieldError('unknown', 'Oops', 'Recover');
  expect(view.element.querySelector('#authorNames-error').textContent).toBe('');
  view.focusField('authorNames');
  expect(document.activeElement).toBe(view.element.querySelector('#authorNames'));
  view.setEditable(false);
  expect(view.element.querySelector('#authorNames').disabled).toBe(true);
  view.setEditable(true);
  view.setValues({ authorNames: 'Author One' });
  expect(view.element.querySelector('#authorNames').value).toBe('Author One');
  view.focusField('unknown');
});

test('submission form view exposes fields and helpers', () => {
  const view = createSubmissionFormView();
  document.body.appendChild(view.element);
  expect(view.element.querySelector('#authorNames')).toBeTruthy();
  expect(view.element.querySelector('#affiliations')).toBeTruthy();
  expect(view.element.querySelector('#contactEmail')).toBeTruthy();
  expect(view.element.querySelector('#abstract')).toBeTruthy();
  expect(view.element.querySelector('#keywords')).toBeTruthy();
  expect(view.element.querySelector('#mainSource')).toBeTruthy();
  expect(view.element.querySelector('#manuscriptFile')).toBeTruthy();
  view.setFieldError('unknown', 'Oops', 'Recover');
  expect(view.element.querySelector('#authorNames-error').textContent).toBe('');
  view.focusField('authorNames');
  expect(document.activeElement).toBe(view.element.querySelector('#authorNames'));
  view.setValues({
    authorNames: 'Author One',
    affiliations: 'Institute',
    contactEmail: 'author@example.com',
    abstract: 'Abstract',
    keywords: 'alpha, beta',
    mainSource: 'file upload',
  });
  expect(view.element.querySelector('#authorNames').value).toBe('Author One');
  expect(view.element.querySelector('#affiliations').value).toBe('Institute');
  expect(view.element.querySelector('#contactEmail').value).toBe('author@example.com');
  expect(view.element.querySelector('#abstract').value).toBe('Abstract');
  expect(view.element.querySelector('#keywords').value).toBe('alpha, beta');
  expect(view.element.querySelector('#mainSource').value).toBe('file upload');
  view.setValues({});
  expect(view.element.querySelector('#authorNames').value).toBe('');
  expect(view.element.querySelector('#affiliations').value).toBe('');
  expect(view.element.querySelector('#contactEmail').value).toBe('');
  expect(view.element.querySelector('#abstract').value).toBe('');
  expect(view.element.querySelector('#keywords').value).toBe('');
  expect(view.element.querySelector('#mainSource').value).toBe('');
  view.setStatus('ok', false);
  expect(view.element.querySelector('.status').textContent).toBe('ok');
  view.setStatus('bad', true);
  expect(view.element.querySelector('.status').className).toContain('error');
  view.focusField('unknown');
  expect(view.getFile()).toBe(null);
});
