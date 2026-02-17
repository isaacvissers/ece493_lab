import { UI_MESSAGES } from '../services/ui-messages.js';
import { validateSubmission } from '../services/submission-validation.js';
import { createSubmissionMetadata } from '../models/submission-metadata.js';
import { createDraftSubmission } from '../models/draft-submission.js';

export function createSubmissionValidationController({
  view,
  sessionState,
  onSubmitSuccess,
}) {
  // Handles final submit vs draft validation and maps validation errors to UI.
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
        manuscriptFileRequired: () => view.setFieldError(
          'manuscriptFile',
          UI_MESSAGES.errors.fileRequired.message,
          UI_MESSAGES.errors.fileRequired.recovery,
        ),
        manuscriptFile: () => view.setFieldError(
          'manuscriptFile',
          UI_MESSAGES.errors.fileTypeInvalid.message,
          UI_MESSAGES.errors.fileTypeInvalid.recovery,
        ),
      };
      if (field === 'manuscriptFile' && code === 'file_required') {
        handlers.manuscriptFileRequired();
        return;
      }
      const handler = handlers[field];
      if (handler) {
        handler();
      }
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    view.clearErrors();
    if (!sessionState.isAuthenticated()) {
      view.setStatus(UI_MESSAGES.errors.accessDenied.message, true);
      return;
    }
    const values = view.getValues();
    const file = view.getFile();
    const validation = validateSubmission(values, file, { mode: 'final' });
    if (!validation.ok) {
      setValidationErrors(validation.errors);
      return;
    }
    createSubmissionMetadata(validation.values);
    view.setStatus(UI_MESSAGES.submissionValidated.body, false);
    if (onSubmitSuccess) {
      onSubmitSuccess();
    }
  }

  function handleSaveDraft() {
    view.clearErrors();
    if (!sessionState.isAuthenticated()) {
      view.setStatus(UI_MESSAGES.errors.accessDenied.message, true);
      return;
    }
    const values = view.getValues();
    const file = view.getFile();
    const validation = validateSubmission(values, file, { mode: 'draft' });
    if (!validation.ok) {
      setValidationErrors(validation.errors);
      return;
    }
    createDraftSubmission(values, file);
    view.setStatus(UI_MESSAGES.draftSaved.body, false);
  }

  return {
    init() {
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
