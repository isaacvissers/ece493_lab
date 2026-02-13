import { UI_MESSAGES } from '../services/ui-messages.js';
import { validateMetadata } from '../services/metadata-validation.js';
import { createManuscriptMetadata } from '../models/manuscript-metadata.js';
import { createMetadataDraft, restoreMetadataDraft } from '../models/metadata-draft.js';

export function createMetadataController({
  view,
  storage,
  sessionState,
  errorLogger,
}) {
  // Coordinates metadata validation, draft saves, and final persistence with UI feedback.
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
        keywords: () => view.setFieldError(
          'keywords',
          UI_MESSAGES.errors.keywordsInvalid.message,
          UI_MESSAGES.errors.keywordsInvalid.recovery,
        ),
        mainSource: () => view.setFieldError(
          'mainSource',
          UI_MESSAGES.errors.mainSourceInvalid.message,
          UI_MESSAGES.errors.mainSourceInvalid.recovery,
        ),
        abstract: () => view.setFieldError(
          'abstract',
          UI_MESSAGES.errors.abstractTooLong.message,
          UI_MESSAGES.errors.abstractTooLong.recovery,
        ),
      };
      const handler = handlers[field];
      if (handler) {
        handler();
      }
    });
  }

  function handleSaveDraft() {
    view.clearErrors();
    const values = view.getValues();
    const validation = validateMetadata(values, { mode: 'draft' });
    if (!validation.ok) {
      setValidationErrors(validation.errors);
      return;
    }
    const userKey = getUserKey();
    if (!userKey) {
      view.setStatus(UI_MESSAGES.errors.accessDenied.message, true);
      return;
    }
    const draft = createMetadataDraft(userKey, validation.values);
    try {
      storage.saveDraft(userKey, draft);
    } catch (error) {
      errorLogger.logFailure({
        errorType: 'storage',
        message: 'metadata_draft_failed',
        context: userKey,
      });
      view.setStatus(UI_MESSAGES.errors.metadataUnavailable.message, true);
      return;
    }
    view.setStatus(UI_MESSAGES.metadataDraftSaved.body, false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    view.clearErrors();
    const values = view.getValues();
    const validation = validateMetadata(values, { mode: 'final' });
    if (!validation.ok) {
      setValidationErrors(validation.errors);
      return;
    }
    const userKey = getUserKey();
    if (!userKey) {
      view.setStatus(UI_MESSAGES.errors.accessDenied.message, true);
      return;
    }
    const metadata = createManuscriptMetadata(userKey, validation.values);
    try {
      storage.saveMetadata(userKey, metadata);
      storage.clearDraft(userKey);
    } catch (error) {
      errorLogger.logFailure({
        errorType: 'storage',
        message: 'metadata_save_failed',
        context: userKey,
      });
      view.setStatus(UI_MESSAGES.errors.metadataUnavailable.message, true);
      return;
    }
    view.setStatus(UI_MESSAGES.metadataSaved.body, false);
    view.setEditable(false);
  }

  return {
    init() {
      const userKey = getUserKey();
      if (userKey) {
        const saved = storage.loadMetadata(userKey);
        if (saved && saved.metadata) {
          view.setValues(saved.metadata);
          if (storage.isFinalized(userKey)) {
            view.setEditable(false);
          }
        }
        const draft = storage.loadDraft(userKey);
        if (draft) {
          const restored = restoreMetadataDraft(draft);
          if (restored) {
            view.setValues({ ...view.getValues(), ...restored });
            view.setStatus(UI_MESSAGES.metadataDraftLoaded.body, false);
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
