function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

export function createFileUploadView() {
  const container = createElement('section', 'card');
  const title = createElement('h1');
  title.textContent = 'Upload manuscript';

  const helper = createElement('p', 'helper');
  helper.textContent = 'Attach your manuscript file (PDF, DOCX, or TEX).';

  const form = document.createElement('form');
  form.noValidate = true;

  const fileRow = createElement('div', 'form-row');
  const fileLabel = document.createElement('label');
  fileLabel.setAttribute('for', 'manuscriptFile');
  fileLabel.textContent = 'Manuscript file';
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.id = 'manuscriptFile';
  fileInput.name = 'manuscriptFile';
  fileInput.accept = '.pdf,.docx,.tex';
  const fileError = createElement('div', 'error');
  fileError.id = 'manuscriptFile-error';
  fileInput.setAttribute('aria-describedby', 'manuscriptFile-error');
  fileRow.append(fileLabel, fileInput, fileError);

  const attachment = createElement('div', 'status');
  attachment.id = 'attachment-status';
  attachment.textContent = 'No file attached.';

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = 'button';
  submitButton.textContent = 'Upload file';

  const status = createElement('div', 'status');
  status.id = 'upload-status';
  status.setAttribute('aria-live', 'polite');

  form.append(fileRow, attachment, submitButton, status);
  container.append(title, helper, form);

  const fieldMap = {
    manuscriptFile: { input: fileInput, error: fileError },
  };

  function clearErrors() {
    Object.values(fieldMap).forEach((field) => {
      field.error.textContent = '';
    });
    status.textContent = '';
    status.className = 'status';
  }

  function setFieldError(field, message, recovery) {
    const target = fieldMap[field];
    if (!target) {
      return;
    }
    target.error.textContent = `${message} ${recovery}`.trim();
  }

  function setStatus(message, isError) {
    status.textContent = message;
    status.className = isError ? 'status error' : 'status';
  }

  function focusField(field) {
    const target = fieldMap[field];
    if (target && target.input) {
      target.input.focus();
    }
  }

  function setAttachment(file) {
    if (!file) {
      attachment.textContent = 'No file attached.';
      return;
    }
    attachment.textContent = `Attached: ${file.originalName} (${file.fileType.toUpperCase()}, ${Math.ceil(file.fileSizeBytes / 1024)} KB)`;
  }

  return {
    element: container,
    getFiles() {
      return fileInput.files ? Array.from(fileInput.files) : [];
    },
    clearErrors,
    setFieldError,
    setStatus,
    focusField,
    setAttachment,
    onSubmit(handler) {
      form.addEventListener('submit', handler);
    },
    onFileChange(handler) {
      fileInput.addEventListener('change', handler);
    },
  };
}
