const FORMS_KEY = 'cms.review_forms';

let cachedForms = null;
let failureMode = false;

function loadForms() {
  if (failureMode) {
    throw new Error('form_store_failure');
  }
  if (cachedForms) {
    return cachedForms;
  }
  const raw = localStorage.getItem(FORMS_KEY);
  cachedForms = raw ? JSON.parse(raw) : [];
  return cachedForms;
}

function persistForms(forms) {
  if (failureMode) {
    throw new Error('form_store_failure');
  }
  localStorage.setItem(FORMS_KEY, JSON.stringify(forms));
  cachedForms = forms;
}

export const reviewFormStore = {
  setFailureMode(enabled) {
    failureMode = Boolean(enabled);
  },
  reset() {
    failureMode = false;
    cachedForms = null;
    localStorage.removeItem(FORMS_KEY);
  },
  saveForm(form) {
    const forms = loadForms().slice();
    forms.push(form);
    persistForms(forms);
    return form;
  },
  getForm(paperId) {
    return loadForms().find((form) => form.paperId === paperId) || null;
  },
};
