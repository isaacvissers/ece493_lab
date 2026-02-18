import { createEditorReviewAccessController } from '../../src/controllers/editor-review-access-controller.js';
import { createEditor } from '../../src/models/editor.js';


test('denies access when permission missing', () => {
  const editor = createEditor({ editorId: 'editor_1', permissions: [] });
  const controller = createEditorReviewAccessController({ editor, requiredPermission: 'review_access' });
  expect(controller.canAccess()).toBe(false);
});
