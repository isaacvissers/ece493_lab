# Quickstart: Validate Paper Submission Fields

## Goal
Verify UC-11 validation on final submit and permissive draft saving.

## Preconditions
- User is authenticated.
- Submission form is open with metadata fields and file upload.

## Scenarios
1. **Valid submit**: Fill all required fields, upload valid .pdf, submit; confirm success.
2. **Missing required**: Leave a required field blank; submit; confirm missing-field error.
3. **Invalid email**: Use invalid email; submit; confirm email format error.
4. **Missing file**: Submit without file; confirm file-required error.
5. **Invalid file type**: Upload invalid file type; submit; confirm accepted-formats error.
6. **Multiple errors**: Leave abstract blank, invalid email, invalid file; confirm all errors shown.
7. **Draft save permissive**: Save draft with missing required fields; confirm draft saved.
8. **Draft format validation**: Save draft with invalid email or invalid file type; confirm format error.
