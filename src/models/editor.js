function generateEditorId() {
  return `editor_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createEditor({ editorId = null, permissions = [] } = {}) {
  return {
    editorId: editorId || generateEditorId(),
    permissions: Array.isArray(permissions) ? permissions : [],
  };
}

export function hasEditorPermission(editor, permission) {
  if (!editor || !Array.isArray(editor.permissions)) {
    return false;
  }
  return editor.permissions.includes(permission);
}
