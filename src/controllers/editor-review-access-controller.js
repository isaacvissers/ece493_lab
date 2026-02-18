import { hasEditorPermission } from '../models/editor.js';

export function createEditorReviewAccessController({ editor, requiredPermission = 'review_access' } = {}) {
  return {
    canAccess() {
      return hasEditorPermission(editor, requiredPermission);
    },
  };
}
