const MAX_FILE_SIZE = 7 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'tex'];

function getFileExtension(name) {
  const parts = name.toLowerCase().split('.');
  return parts.length > 1 ? parts.pop() : '';
}

export function validateManuscriptFile(file) {
  if (!file) {
    return { ok: false, error: { code: 'file_required' } };
  }
  const extension = getFileExtension(file.name);
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return { ok: false, error: { code: 'file_type_invalid' } };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { ok: false, error: { code: 'file_too_large' } };
  }
  return { ok: true, extension };
}

export function createManuscriptFile(file) {
  return {
    id: `file_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`,
    originalName: file.name,
    fileType: getFileExtension(file.name),
    fileSizeBytes: file.size,
    uploadedAt: new Date().toISOString(),
  };
}

export const manuscriptFileRules = {
  maxSizeBytes: MAX_FILE_SIZE,
  allowedExtensions: ALLOWED_EXTENSIONS.slice(),
};
