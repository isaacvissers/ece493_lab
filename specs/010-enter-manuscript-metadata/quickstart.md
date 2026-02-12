# Quickstart: Enter Manuscript Metadata

## Goal
Verify UC-10 metadata entry, validation, draft save, and failure handling.

## Preconditions
- User is authenticated.
- Submission form is open.

## Scenarios
1. **View fields**: Confirm all required metadata fields are visible and editable.
2. **Valid save**: Enter valid metadata and save; verify persistence on reload.
3. **Save draft**: Save partial metadata as draft; reopen and verify values.
4. **Missing required**: Leave a required field blank; verify missing-field error.
5. **Invalid contact**: Enter invalid email; verify contact error.
6. **Invalid keywords**: Enter 0 keywords or >10; verify keywords error.
7. **Storage failure**: Simulate DB write failure; verify save-unavailable error and log.

