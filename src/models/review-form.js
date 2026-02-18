function generateFormId() {
  return `form_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createReviewForm({
  formId = null,
  paperId,
  status = 'active',
  fields = [],
  requiredFields = [],
} = {}) {
  return {
    formId: formId || generateFormId(),
    paperId,
    status,
    fields: Array.isArray(fields) ? fields : [],
    requiredFields: Array.isArray(requiredFields) ? requiredFields : [],
  };
}

export function isFormClosed(form) {
  if (!form) {
    return false;
  }
  return (form.status || '').toLowerCase() === 'closed';
}
