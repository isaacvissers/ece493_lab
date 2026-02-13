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

export function createMetadataFormView() {
  const container = createElement('section', 'card');
  const title = createElement('h1');
  title.textContent = 'Enter manuscript metadata';

  const helper = createElement('p', 'helper');
  helper.textContent = 'Provide required manuscript details to continue.';

  const form = document.createElement('form');
  form.noValidate = true;

  const authorRow = createInputRow({ id: 'authorNames', label: 'Author names', placeholder: 'Author One, Author Two' });
  const affiliationRow = createInputRow({ id: 'affiliations', label: 'Affiliations', placeholder: 'University, Lab' });
  const emailRow = createInputRow({ id: 'contactEmail', label: 'Contact email', type: 'email', placeholder: 'author@example.com' });
  const abstractRow = createInputRow({ id: 'abstract', label: 'Abstract', type: 'textarea' });
  const keywordsRow = createInputRow({ id: 'keywords', label: 'Keywords', placeholder: 'keyword1, keyword2' });

  const sourceRow = createElement('div', 'form-row');
  const sourceLabel = document.createElement('label');
  sourceLabel.setAttribute('for', 'mainSource');
  sourceLabel.textContent = 'Main source';
  const sourceSelect = document.createElement('select');
  sourceSelect.id = 'mainSource';
  sourceSelect.name = 'mainSource';
  const optionPlaceholder = document.createElement('option');
  optionPlaceholder.value = '';
  optionPlaceholder.textContent = 'Select a source';
  const optionFile = document.createElement('option');
  optionFile.value = 'file upload';
  optionFile.textContent = 'File upload';
  const optionExternal = document.createElement('option');
  optionExternal.value = 'external repository link';
  optionExternal.textContent = 'External repository link';
  sourceSelect.append(optionPlaceholder, optionFile, optionExternal);
  const sourceError = createElement('div', 'error');
  sourceError.id = 'mainSource-error';
  sourceSelect.setAttribute('aria-describedby', 'mainSource-error');
  sourceRow.append(sourceLabel, sourceSelect, sourceError);

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = 'button';
  submitButton.textContent = 'Save metadata';

  const draftButton = document.createElement('button');
  draftButton.type = 'button';
  draftButton.className = 'button secondary';
  draftButton.id = 'save-draft';
  draftButton.textContent = 'Save draft';

  const status = createElement('div', 'status');
  status.setAttribute('aria-live', 'polite');

  form.append(
    authorRow.row,
    affiliationRow.row,
    emailRow.row,
    abstractRow.row,
    keywordsRow.row,
    sourceRow,
    submitButton,
    draftButton,
    status,
  );
  container.append(title, helper, form);

  const fieldMap = {
    authorNames: authorRow,
    affiliations: affiliationRow,
    contactEmail: emailRow,
    abstract: abstractRow,
    keywords: keywordsRow,
    mainSource: { input: sourceSelect, error: sourceError },
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

  function setEditable(enabled) {
    Object.values(fieldMap).forEach((field) => {
      field.input.disabled = !enabled;
    });
    submitButton.disabled = !enabled;
    draftButton.disabled = !enabled;
  }

  return {
    element: container,
    getValues() {
      return {
        authorNames: authorRow.input.value,
        affiliations: affiliationRow.input.value,
        contactEmail: emailRow.input.value,
        abstract: abstractRow.input.value,
        keywords: keywordsRow.input.value,
        mainSource: sourceSelect.value,
      };
    },
    setValues(values) {
      authorRow.input.value = values.authorNames || '';
      affiliationRow.input.value = values.affiliations || '';
      emailRow.input.value = values.contactEmail || '';
      abstractRow.input.value = values.abstract || '';
      keywordsRow.input.value = values.keywords || '';
      sourceSelect.value = values.mainSource || '';
    },
    clearErrors,
    setFieldError,
    setStatus,
    focusField,
    setEditable,
    onSubmit(handler) {
      form.addEventListener('submit', handler);
    },
    onSaveDraft(handler) {
      draftButton.addEventListener('click', handler);
    },
  };
}
