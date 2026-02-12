# Quickstart: Upload Manuscript File Within Constraints

## Goal
Verify UC-09 upload behavior for valid files, invalid files, failures, and cancel flow.

## Preconditions
- User is authenticated.
- Submission form is open.

## Scenarios
1. **Valid upload**: Upload `valid.pdf` (<=7MB) and verify attachment.
2. **Valid Word**: Upload `valid.docx` and verify attachment.
3. **Valid LaTeX**: Upload `valid.tex` and verify attachment.
4. **Invalid type**: Upload `invalid.txt` and verify format error.
5. **Oversize**: Upload `oversize.pdf` (>7MB) and verify size error.
6. **Upload failure retry**: Simulate upload failure, retry, verify attachment.
7. **Storage failure**: Simulate storage write failure, verify error, no attachment, and log entry.
8. **Cancel selection**: Cancel file chooser and verify no attachment.
9. **Replace upload**: Upload a different valid file and verify attachment is replaced.

