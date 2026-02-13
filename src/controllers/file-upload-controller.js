import { UI_MESSAGES } from '../services/ui-messages.js';
import { validateManuscriptFile, createManuscriptFile } from '../models/manuscript-file.js';

export function createFileUploadController({
  view,
  storage,
  sessionState,
  errorLogger,
}) {
  function getUserKey() {
    const user = sessionState.getCurrentUser();
    return user && user.email ? user.email : null;
  }

  function mapError(error) {
    if (!error || !error.code) {
      return UI_MESSAGES.errors.uploadFailed;
    }
    const mapping = {
      file_required: UI_MESSAGES.errors.fileRequired,
      file_type_invalid: UI_MESSAGES.errors.fileTypeInvalid,
      file_too_large: UI_MESSAGES.errors.fileTooLarge,
      multiple_files: UI_MESSAGES.errors.multipleFiles,
    };
    return mapping[error.code] || UI_MESSAGES.errors.uploadFailed;
  }

  function attachFile(file) {
    const fileRecord = createManuscriptFile(file);
    const userKey = getUserKey();
    const previous = storage.getAttachment(userKey);
    storage.saveManuscriptFile(fileRecord);
    storage.attachFile(userKey, fileRecord.id);
    if (previous && previous.manuscriptFileId && previous.manuscriptFileId !== fileRecord.id) {
      storage.removeManuscriptFile(previous.manuscriptFileId);
    }
    view.setAttachment(fileRecord);
    view.setStatus(UI_MESSAGES.uploadSuccess.body, false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    view.clearErrors();
    const userKey = getUserKey();
    if (!userKey) {
      view.setStatus(UI_MESSAGES.errors.accessDenied.message, true);
      return;
    }
    const files = view.getFiles();
    if (files.length === 0) {
      const error = mapError({ code: 'file_required' });
      view.setFieldError('manuscriptFile', error.message, error.recovery);
      view.focusField('manuscriptFile');
      return;
    }
    if (files.length > 1) {
      const error = mapError({ code: 'multiple_files' });
      view.setFieldError('manuscriptFile', error.message, error.recovery);
      view.focusField('manuscriptFile');
      return;
    }
    const file = files[0];
    const validation = validateManuscriptFile(file);
    if (!validation.ok) {
      const error = mapError(validation.error);
      view.setFieldError('manuscriptFile', error.message, error.recovery);
      view.focusField('manuscriptFile');
      return;
    }
    if (file.failUpload) {
      const error = mapError();
      view.setFieldError('manuscriptFile', error.message, error.recovery);
      return;
    }
    try {
      attachFile(file);
    } catch (error) {
      errorLogger.logFailure({
        errorType: 'storage',
        message: 'upload_storage_failed',
        context: userKey,
      });
      view.setStatus(UI_MESSAGES.errors.uploadStorageFailure.message, true);
    }
  }

  function handleFileChange() {
    const files = view.getFiles();
    if (files.length === 0) {
      return;
    }
    if (files.length > 1) {
      const error = mapError({ code: 'multiple_files' });
      view.setFieldError('manuscriptFile', error.message, error.recovery);
      return;
    }
    const validation = validateManuscriptFile(files[0]);
    if (!validation.ok) {
      const error = mapError(validation.error);
      view.setFieldError('manuscriptFile', error.message, error.recovery);
    }
  }

  return {
    init() {
      const userKey = getUserKey();
      if (userKey) {
        const attachment = storage.getAttachment(userKey);
        if (attachment && attachment.file) {
          view.setAttachment(attachment.file);
        }
      }
      view.onSubmit(handleSubmit);
      view.onFileChange(handleFileChange);
    },
    requireAuth() {
      if (!sessionState.isAuthenticated()) {
        view.setStatus(UI_MESSAGES.errors.accessDenied.message, true);
        return false;
      }
      return true;
    },
  };
}
