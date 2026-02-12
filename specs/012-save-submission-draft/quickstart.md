# Quickstart: Save Submission Draft

## Goal
Verify UC-12 draft save, restore, and failure handling.

## Preconditions
- User is authenticated.
- Submission form is open.

## Scenarios
1. **Save draft**: Enter partial metadata, click Save Draft; confirm confirmation or “Last saved at” indicator.
2. **Reopen draft**: Leave form, reopen draft; confirm saved values and optional file restored.
3. **Overwrite draft**: Edit fields, save again, reopen; confirm latest values persist.
4. **Permissive save**: Save draft with incomplete/invalid final fields; confirm save succeeds and optional warning shown.
5. **File attachment**: Save draft with file attached; reopen and confirm attachment present.
6. **Save failure**: Simulate storage failure; confirm error, log, and previous draft preserved.
7. **Session expired**: Save with expired session; confirm redirect to login and retry save.
8. **Load failure**: Simulate retrieval failure; confirm error and editing blocked.
