import { UI_MESSAGES } from '../services/ui-messages.js';
import { validateManuscript, createManuscript } from '../models/manuscript.js';
import { validateDraft, createDraft, restoreDraft } from '../models/submission-draft.js';

const MAX_FILE_SIZE = 7 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'tex'];

function getFileExtension(name) {
  const parts = name.toLowerCase().split('.');
  return parts.length > 1 ? parts.pop() : '';
}

function buildFileMeta(file) {
  return {
    originalName: file.name,
    fileType: getFileExtension(file.name),
    fileSizeBytes: file.size,
  };
}

export function createManuscriptSubmissionController({
  view,
  storage,
  sessionState,
  errorLogger,
  onSubmitSuccess,
}) {
  function getUserKey() {
    const user = sessionState.getCurrentUser();
    return user && user.email ? user.email : null;
  }

  function setValidationErrors(errors) {
    Object.entries(errors).forEach(([field, code]) => {
      if (code === 'required') {
        const label = UI_MESSAGES.labels[field] || field;
        const message = UI_MESSAGES.errors.required(label);
        view.setFieldError(field, message.message, message.recovery);
        return;
      }
      const handlers = {
        contactEmail: () => view.setFieldError(
          'contactEmail',
          UI_MESSAGES.errors.emailFormat.message,
          UI_MESSAGES.errors.emailFormat.recovery,
        ),
        authorNames: () => view.setFieldError(
          'authorNames',
          UI_MESSAGES.errors.authorNamesInvalid.message,
          UI_MESSAGES.errors.authorNamesInvalid.recovery,
        ),
        keywords: () => view.setFieldError(
          'keywords',
          UI_MESSAGES.errors.keywordsInvalid.message,
          UI_MESSAGES.errors.keywordsInvalid.recovery,
        ),
      };
      const handler = handlers[field];
      if (handler) {
        handler();
      }
    });
  }

  function validateFile(file) {
    if (!file) {
      return { ok: false, error: UI_MESSAGES.errors.fileRequired };
    }
    const extension = getFileExtension(file.name);
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return { ok: false, error: UI_MESSAGES.errors.fileTypeInvalid };
    }
    if (file.size > MAX_FILE_SIZE) {
      return { ok: false, error: UI_MESSAGES.errors.fileTooLarge };
    }
    if (file.failUpload) {
      return { ok: false, error: UI_MESSAGES.errors.uploadFailed };
    }
    return { ok: true };
  }

  function handleSaveDraft() {
    view.clearErrors();
    const values = view.getValues();
    const draftValidation = validateDraft(values);
    if (!draftValidation.ok) {
      setValidationErrors(draftValidation.errors);
      return;
    }
    const userKey = getUserKey();
    if (!userKey) {
      view.setStatus(UI_MESSAGES.errors.accessDenied.message, true);
      return;
    }
    const draft = createDraft(draftValidation.values, null);
    try {
      storage.saveDraft(userKey, draft);
    } catch (error) {
      errorLogger.logFailure({
        errorType: 'storage',
        message: 'draft_save_failed',
        context: userKey,
      });
      view.setStatus(UI_MESSAGES.errors.submissionUnavailable.message, true);
      return;
    }
    view.setStatus(UI_MESSAGES.draftSaved.body, false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    view.clearErrors();
    const values = view.getValues();
    const validation = validateManuscript(values);
    if (!validation.ok) {
      setValidationErrors(validation.errors);
      return;
    }

    const file = view.getFile();
    const fileValidation = validateFile(file);
    if (!fileValidation.ok) {
      view.setFieldError('manuscriptFile', fileValidation.error.message, fileValidation.error.recovery);
      view.focusField('manuscriptFile');
      return;
    }

    const fileMeta = buildFileMeta(file);
    const manuscript = createManuscript(validation.values, fileMeta);
    try {
      storage.saveSubmission(manuscript);
      const userKey = getUserKey();
      if (userKey) {
        storage.clearDraft(userKey);
      }
    } catch (error) {
      errorLogger.logFailure({
        errorType: 'storage',
        message: 'submission_failed',
        context: manuscript.id,
      });
      view.setStatus(UI_MESSAGES.errors.submissionUnavailable.message, true);
      return;
    }

    view.setStatus(`${UI_MESSAGES.submissionSuccess.title}. ${UI_MESSAGES.submissionSuccess.body}`, false);
    if (onSubmitSuccess) {
      onSubmitSuccess();
    }
  }

  return {
    init() {
      const userKey = getUserKey();
      if (userKey) {
        const draft = storage.loadDraft(userKey);
        if (draft) {
          const restored = restoreDraft(draft);
          if (restored) {
            view.setValues(restored);
            view.setStatus(UI_MESSAGES.draftLoaded.body, false);
          }
        }
      }
      view.onSubmit(handleSubmit);
      view.onSaveDraft(handleSaveDraft);
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
