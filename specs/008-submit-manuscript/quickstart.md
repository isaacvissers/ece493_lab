# Quickstart: Submit Paper Manuscript

## Goal
Verify the UC-08 manuscript submission flow (success, validation errors, and retry behavior).

## Preconditions
- User is authenticated for success paths.
- LocalStorage is available.

## Scenarios
1. **Valid submission**: Fill all required metadata, upload a valid PDF <=7MB, submit, see success + redirect.
2. **Missing fields**: Leave required field empty, submit, verify missing-field errors.
3. **Invalid email**: Enter invalid email format, submit, verify format error.
4. **Invalid file type**: Upload unsupported file type, verify rejection and accepted format list.
5. **Oversize file**: Upload file >7MB, verify size error.
6. **Upload failure retry**: Simulate upload failure, retry, succeed without losing metadata.
7. **Storage failure**: Simulate storage write failure, verify submission-unavailable error and error log entry.
8. **Save draft**: Save partial metadata and verify draft saved confirmation.
9. **Performance check**: Submit a valid manuscript and confirm the UI responds within ~200 ms (excluding file upload time).
