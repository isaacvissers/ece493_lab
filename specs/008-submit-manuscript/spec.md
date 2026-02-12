# Feature Specification: Submit Paper Manuscript

**Feature Branch**: `008-submit-manuscript`  
**Created**: 2026-02-01  
**Status**: Draft  
**Input**: User description: "UC-08"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Submit Paper Manuscript (Priority: P1)

A logged-in author submits a manuscript with required metadata and a compliant file
so the submission is recorded and ready for review.

**Why this priority**: Manuscript submission is the core author workflow and must
work during the submission window.

**Independent Test**: A logged-in author submits a valid manuscript and receives
confirmation; invalid metadata or file issues block submission with clear errors.

**Acceptance Scenarios** (derived from `lab1_files/S-08.md` and `lab1_files/AT-08.md`):

1. **Given** an authenticated author, **When** they open **Submit Paper**, **Then** the
   submission form is displayed.
2. **Given** valid metadata and a valid file, **When** the author submits, **Then**
   the system validates fields and file, stores metadata + file, shows success, and
   redirects to the author home page (Author Dashboard).
3. **Given** the author is not logged in, **When** they attempt to submit, **Then**
   they are redirected to login and returned to the submission page after login.
4. **Given** the author clicks **Save Draft**, **When** required data is sufficient for
   saving (title + contact email), **Then** the draft is saved and confirmed.
5. **Given** required fields are missing, **When** the author submits, **Then** the
   system rejects submission and identifies missing fields.
6. **Given** invalid field content (e.g., invalid email), **When** the author submits,
   **Then** the system rejects submission and identifies invalid fields.
7. **Given** an invalid file type, **When** the author submits, **Then** the system
   rejects submission and lists accepted formats.
8. **Given** an oversize file (> 7MB), **When** the author submits, **Then** the system
   rejects submission and reports the size limit.
9. **Given** a file upload failure, **When** the author retries upload, **Then** the
   submission proceeds only after a successful upload.
10. **Given** a database/storage write failure, **When** submission is saved, **Then**
    the system shows a submission-unavailable error, logs the failure, and does not
    mark the manuscript as submitted.

### Edge Cases

- Author submits whitespace-only text fields.
- Author saves a draft with partial metadata and no file.
- Author retries after upload failure without losing prior form entries.

### Assumptions & Dependencies

- Required metadata includes: title, author names, affiliations, contact email,
  abstract, keywords, and main source.
- Accepted file types: PDF, Word (.docx), and LaTeX (.tex as a single source file only;
  no bundles).
- File size limit is 7MB.
- Draft save capability is included for this feature.
- Draft save requires a minimal set: title + contact email.
- Logging for submission/storage failures is available (transient; no persistence required).
- Author home page refers to the **Author Dashboard** view.

### Out of Scope

- Editing or replacing a manuscript after final submission.
- Reviewer assignment and review workflow.
- Plagiarism checks or format conversions.

### Traceability

- Use Case: `lab1_files/UC-08.md`
- Scenarios: `lab1_files/S-08.md`
- Acceptance Tests: `lab1_files/AT-08.md`

## Clarifications

### Session 2026-02-01

- Q: What is the minimum data required to save a draft? → A: Title + contact email.
- Q: How should LaTeX submissions be provided? → A: Single .tex file only (no bundles).
- Q: Can a submission be edited or replaced after successful submission? → A: No; submit a new manuscript.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST restrict submission to authenticated authors.
- **FR-002**: System MUST present a manuscript submission form with required metadata
  fields and file upload.
- **FR-003**: System MUST validate required fields and report missing fields.
- **FR-004**: System MUST validate field formats and report invalid fields, including:
  contact email format, at least one author name, and keywords provided as a comma-
  separated list.
- **FR-005**: System MUST accept file types PDF, Word (.docx), or LaTeX (.tex) only.
- **FR-005a**: LaTeX submissions MUST be a single `.tex` file (no bundles).
- **FR-006**: System MUST reject files larger than 7MB.
- **FR-007**: System MUST store manuscript metadata and file on successful submission.
- **FR-008**: System MUST show a success confirmation and redirect the author to their
  home page (Author Dashboard) after successful submission.
- **FR-009**: System MUST support saving a draft submission when title + contact email
  are provided, and confirm draft saved.
- **FR-010**: If file upload fails, system MUST show an error and allow retry without
  losing entered metadata.
- **FR-011**: If database/storage write fails, system MUST show a submission-unavailable
  error that instructs the author to retry later, log the failure (transient), and not
  mark the manuscript as submitted.
- **FR-012**: After login (if unauthenticated), system MUST return the author to the
  submission page.
- **FR-013**: After successful submission, system MUST treat the submission as final;
  changes require a new submission.
- **FR-014**: System MUST allow reopening a saved draft and restoring its saved metadata.
- **FR-015**: System MUST treat whitespace-only required fields as missing.

### Key Entities *(include if feature involves data)*

- **Manuscript**: Metadata for the submission (title, authors, abstract, keywords, main source).
- **Submission File**: Uploaded manuscript file (PDF/DOCX/TEX).
- **Submission Draft**: Partially completed submission state.
- **Submission Error Log**: Captures storage/upload failures (transient).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of valid submissions store metadata + file and show success.
- **SC-002**: 100% of missing/invalid field submissions are rejected with clear errors.
- **SC-003**: 100% of invalid file type or oversize submissions are rejected.
- **SC-004**: 100% of upload failures block submission and allow retry.
- **SC-005**: 100% of storage failures show submission-unavailable error and are logged.
- **SC-006**: 100% of saved drafts persist the entered data and can be reopened.

### Non-Functional Requirements

- **NFR-001**: Interactive actions (validation feedback, submit clicks, and navigation)
  MUST respond within 200 ms on a typical development laptop (excluding actual file
  upload time).
- **NFR-002**: Error messages and validation feedback MUST be accessible using
  semantic HTML and keyboard navigation.
