# Feature Specification: Validate Paper Submission Fields

**Feature Branch**: `011-validate-submission-fields`  
**Created**: 2026-02-02  
**Status**: Draft  
**Input**: User description: "UC-11"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Validate Submission on Final Submit (Priority: P1)

A logged-in author submits a paper and the system validates required fields, contact email, and manuscript file type so invalid submissions are blocked with clear errors.

**Why this priority**: Validation is required on every final submission and prevents invalid submissions from entering the workflow.

**Independent Test**: With valid metadata and a valid file, submit succeeds; with any missing/invalid required field or file type, submit is blocked with clear errors.

**Acceptance Scenarios** (derived from `lab1_files/S-11.md` and `lab1_files/AT-11.md`):

1. **Given** an authenticated author with all required fields completed and a valid manuscript file on the submit paper form, **When** they click **Submit**, **Then** all validations pass and submission proceeds to confirmation. The validation controls are in the same form as metadata and upload.
2. **Given** a required field is missing, **When** the author clicks **Submit**, **Then** the system blocks submission and shows missing-field errors.
3. **Given** the contact email is invalid, **When** the author clicks **Submit**, **Then** the system blocks submission and shows an email format error.
4. **Given** no manuscript file is provided, **When** the author clicks **Submit**, **Then** the system blocks submission and shows a file-required error.
5. **Given** a manuscript file type is not accepted, **When** the author clicks **Submit**, **Then** the system blocks submission and lists accepted formats (.pdf, .doc, .docx, .tex).
6. **Given** multiple validation errors occur at once, **When** the author clicks **Submit**, **Then** the system shows all relevant errors in a single response.
7. **Given** the author saves a draft with incomplete fields, **When** they click **Save Draft**, **Then** the system saves the draft without requiring required-field validations and confirms draft saved.
8. **Given** the author saves a draft with a provided email or manuscript file, **When** they click **Save Draft**, **Then** the system validates formats for any provided email and file type and rejects invalid formats with errors.

### Edge Cases

- Author provides a valid file but leaves multiple required fields blank at once (covered by FR-007).
- Author corrects errors and resubmits immediately after failure (covered by FR-009).
- Draft saved with no manuscript file selected (allowed by FR-008, format validation enforced by FR-010).

### Assumptions & Dependencies

- Required fields include: author names, affiliations, contact email, abstract, keywords, main source, manuscript file.
- Draft saving is supported and does not require required-field validations, but does validate formats for any provided email or manuscript file type.
- File size validation (≤7MB) is handled by a different use case (UC-09).
- Validation occurs on final submit and does not alter data unless validations pass.
- Accepted file extensions are .pdf, .doc, .docx, and .tex.
- Validation depends on the submission form state containing current metadata values and selected file metadata at the time of submit/draft.
- Validation controls are presented within the submit paper form alongside metadata and upload controls
  (no separate validation page required).

### Out of Scope

- File size validation and upload workflow beyond type checking.
- Reviewer assignment or post-submission workflow.
- Detailed field constraints beyond those explicitly listed in UC-11.

### Traceability

- Use Case: `lab1_files/UC-11.md`
- Scenarios: `lab1_files/S-11.md`
- Acceptance Tests: `lab1_files/AT-11.md`

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST validate that all required submission fields are present on final submit.
- **FR-002**: System MUST validate contact email format on final submit.
- **FR-003**: System MUST require a manuscript file on final submit.
- **FR-004**: System MUST accept only .pdf, .doc, .docx, or .tex manuscript files for final submit.
- **FR-005**: System MUST block final submission when any validation fails.
- **FR-006**: System MUST display clear error messages identifying each failing field.
- **FR-007**: System MUST display all validation errors in a single response when multiple failures occur.
- **FR-008**: System MUST allow draft saving without requiring final-submit validations.
- **FR-009**: System MUST allow final submission to proceed to confirmation when all validations pass.
- **FR-010**: Draft save MUST validate formats for any provided contact email and manuscript file type.
- **FR-011**: Error messages MUST identify the failing field and provide corrective guidance.

### Key Entities *(include if feature involves data)*

- **Submission Metadata**: Author names, affiliations, contact email, abstract, keywords, main source.
- **Manuscript File**: Uploaded file metadata including filename and type.
- **Validation Errors**: Error list associated with a submission attempt.
- **Draft Submission**: Partial submission state saved without final validations.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of final submissions with missing required fields are blocked with clear errors.
- **SC-002**: 100% of final submissions with invalid email formats are blocked with an email error.
- **SC-003**: 100% of final submissions missing a manuscript file are blocked with a file-required error.
- **SC-004**: 100% of final submissions with invalid file types are blocked with an accepted-formats error.
- **SC-005**: 100% of valid final submissions proceed to confirmation.
- **SC-006**: 100% of draft saves succeed without requiring final-submit validations.

### Non-Functional Requirements

- **NFR-001**: Validation feedback MUST be shown within 200 ms from submit action to on-screen feedback (end-to-end in the UI).
- **NFR-002**: Validation feedback (errors and success states) MUST be accessible via semantic HTML and keyboard navigation.

## Clarifications

### Session 2026-02-02

- Q: Should draft save validate formats for provided email/file type? → A: Yes — validate formats for provided email/file type, but allow missing required fields.
- Q: Which manuscript file extensions are accepted? → A: .pdf, .doc, .docx, .tex.
- Q: Which fields are required on final submit? → A: author names, affiliations, contact email, abstract, keywords, main source, manuscript file.
