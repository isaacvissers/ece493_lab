function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

function createInputRow({ id, label, type = 'text', placeholder }) {
  const row = createElement('div', 'form-row');
  const labelEl = document.createElement('label');
  labelEl.setAttribute('for', id);
  labelEl.textContent = label;
  const input = document.createElement(type === 'textarea' ? 'textarea' : 'input');
  if (type !== 'textarea') {
    input.type = type;
  }
  input.id = id;
  input.name = id;
  if (placeholder) {
    input.placeholder = placeholder;
  }
  const error = createElement('div', 'error');
  error.id = `${id}-error`;
  input.setAttribute('aria-describedby', `${id}-error`);
  row.append(labelEl, input, error);
  return { row, input, error };
}

export function createSubmitManuscriptView() {
  const container = createElement('section', 'card');
  const title = createElement('h1');
  title.textContent = 'Submit paper';

  const helper = createElement('p', 'helper');
  helper.textContent = 'Complete metadata, upload your manuscript, and validate before submitting.';

  const form = document.createElement('form');
  form.noValidate = true;

  const steps = document.createElement('ul');
  steps.className = 'helper';
  const stepMetadata = document.createElement('li');
  stepMetadata.textContent = 'Enter metadata';
  const stepUpload = document.createElement('li');
  stepUpload.textContent = 'Upload manuscript';
  const stepValidate = document.createElement('li');
  stepValidate.textContent = 'Validate and submit';
  steps.append(stepMetadata, stepUpload, stepValidate);

  const titleRow = createInputRow({ id: 'title', label: 'Title', placeholder: 'Manuscript title' });
  const authorRow = createInputRow({ id: 'authorNames', label: 'Author names', placeholder: 'Author One, Author Two' });
  const affiliationRow = createInputRow({ id: 'affiliations', label: 'Affiliations', placeholder: 'University, Lab' });
  const emailRow = createInputRow({ id: 'contactEmail', label: 'Contact email', type: 'email', placeholder: 'author@example.com' });
  const abstractRow = createInputRow({ id: 'abstract', label: 'Abstract', type: 'textarea' });
  const keywordsRow = createInputRow({ id: 'keywords', label: 'Keywords', placeholder: 'keyword1, keyword2' });
  const sourceRow = createInputRow({ id: 'mainSource', label: 'Main source', placeholder: 'Primary contribution' });

  const metadataSection = document.createElement('fieldset');
  const metadataLegend = document.createElement('legend');
  metadataLegend.textContent = 'Enter metadata';
  metadataSection.append(
    metadataLegend,
    titleRow.row,
    authorRow.row,
    affiliationRow.row,
    emailRow.row,
    abstractRow.row,
    keywordsRow.row,
    sourceRow.row,
  );

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

  const uploadSection = document.createElement('fieldset');
  const uploadLegend = document.createElement('legend');
  uploadLegend.textContent = 'Upload manuscript';
  uploadSection.append(uploadLegend, fileRow);

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = 'button';
  submitButton.textContent = 'Validate and submit';

  const draftButton = document.createElement('button');
  draftButton.type = 'button';
  draftButton.className = 'button secondary';
  draftButton.id = 'save-draft';
  draftButton.textContent = 'Save draft';

  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.className = 'button secondary';
  backButton.id = 'back-to-dashboard';
  backButton.textContent = 'Back to dashboard';

  const status = createElement('div', 'status');
  status.setAttribute('aria-live', 'polite');

  form.append(
    steps,
    metadataSection,
    uploadSection,
    submitButton,
    draftButton,
    backButton,
    status,
  );
  container.append(title, helper, form);

  const fieldMap = {
    title: titleRow,
    authorNames: authorRow,
    affiliations: affiliationRow,
    contactEmail: emailRow,
    abstract: abstractRow,
    keywords: keywordsRow,
    mainSource: sourceRow,
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

  return {
    element: container,
    getValues() {
      return {
        title: titleRow.input.value,
        authorNames: authorRow.input.value,
        affiliations: affiliationRow.input.value,
        contactEmail: emailRow.input.value,
        abstract: abstractRow.input.value,
        keywords: keywordsRow.input.value,
        mainSource: sourceRow.input.value,
      };
    },
    getFile() {
      return fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;
    },
    setValues(values) {
      titleRow.input.value = values.title || '';
      authorRow.input.value = values.authorNames || '';
      affiliationRow.input.value = values.affiliations || '';
      emailRow.input.value = values.contactEmail || '';
      abstractRow.input.value = values.abstract || '';
      keywordsRow.input.value = values.keywords || '';
      sourceRow.input.value = values.mainSource || '';
    },
    clearErrors,
    setFieldError,
    setStatus,
    focusField,
    onSubmit(handler) {
      form.addEventListener('submit', handler);
    },
    onSaveDraft(handler) {
      draftButton.addEventListener('click', handler);
    },
    onBack(handler) {
      backButton.addEventListener('click', handler);
    },
  };
}
