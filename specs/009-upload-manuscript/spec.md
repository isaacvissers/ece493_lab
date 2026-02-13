# Feature Specification: Upload Manuscript File Within Constraints

**Feature Branch**: `009-upload-manuscript`  
**Created**: 2026-02-01  
**Status**: Draft  
**Input**: User description: "UC-09"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Upload Manuscript File (Priority: P1)

A logged-in author uploads a manuscript file in an accepted format and within the size
limit so the file is attached to their submission.

**Why this priority**: File upload is required for every submission and blocks progress
if it fails.

**Independent Test**: A logged-in author uploads a valid file and sees it attached;
invalid types/sizes are rejected with clear errors and retry is allowed for failures.

**Acceptance Scenarios** (derived from `lab1_files/S-09.md` and `lab1_files/AT-09.md`):

1. **Given** an authenticated author on the submission form, **When** they upload a valid
   PDF/DOCX/TEX file (<= 7MB), **Then** the file uploads, is stored, and is attached to the submission.
2. **Given** an invalid file type, **When** the author uploads, **Then** the system rejects it and
   lists accepted formats.
3. **Given** an oversize file (> 7MB), **When** the author uploads, **Then** the system rejects it
   and reports the size limit.
4. **Given** an upload failure, **When** the author retries, **Then** the upload succeeds and the
   file is attached without duplicate attachments.
5. **Given** a storage/write failure after upload, **When** the system attempts to save, **Then**
   it shows a storage failure error, logs the failure, and does not attach the file.
6. **Given** the author cancels file selection, **When** they return to the form, **Then** no
   file is attached and the submission state remains unchanged.

### Edge Cases

- Author attempts to upload multiple files in a single action. (Handled by FR-011)
- Author replaces an already-attached file with a new valid file. (Handled by FR-010)
- Author uploads a file with an uppercase extension (e.g., `.PDF`). (Handled by FR-012)

### Assumptions & Dependencies

- Accepted file types are PDF, Word (.docx), and LaTeX (.tex as a single source file only).
- Accepted extensions are `.pdf`, `.docx`, and `.tex` only.
- AT-09 notes possible extension variants (e.g., `.zip`), but UC-09 enforces only the extensions listed here.
- File size limit is 7MB.
- Virus/malware scanning is not required.
- If a new file is uploaded before final submission, it replaces the previous attachment.
- Logging for upload/storage failures is available (transient; no persistence required).

### Out of Scope

- Final submission workflow beyond attaching a file.
- File format conversions or previews.
- Version history of uploaded files.

### Traceability

- Use Case: `lab1_files/UC-09.md`
- Scenarios: `lab1_files/S-09.md`
- Acceptance Tests: `lab1_files/AT-09.md`

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow authenticated authors to select a manuscript file for upload.
- **FR-002**: System MUST accept only PDF, Word (.docx), or LaTeX (.tex) file types.
- **FR-002a**: System MUST accept only the `.pdf`, `.docx`, and `.tex` file extensions.
- **FR-003**: System MUST reject files larger than 7MB.
- **FR-004**: System MUST upload and store valid files and attach them to the submission.
- **FR-005**: System MUST display an error listing accepted formats when file type is invalid,
  and the message MUST include: “Accepted formats: .pdf, .docx, .tex”.
- **FR-006**: System MUST display an error when file size exceeds 7MB.
- **FR-007**: If upload fails, system MUST show an error and allow retry without creating duplicates.
- **FR-007a**: “No duplicate attachments” means only one active attachment exists after retry;
  any failed attempt MUST NOT create an attached file record.
- **FR-008**: If storage/write fails, system MUST show a storage failure error, log the failure
  (transient), and not attach the file.
- **FR-009**: If file selection is cancelled, system MUST leave the submission unchanged.
- **FR-010**: If a new valid file is uploaded before final submission, system MUST replace the
  prior attachment.
- **FR-011**: If multiple files are selected, system MUST reject the selection and prompt the
  author to choose a single file.
- **FR-012**: System MUST treat file extensions case-insensitively when validating types.

### Key Entities *(include if feature involves data)*

- **Manuscript File**: Uploaded file metadata (name, type, size).
- **Submission Attachment**: Link between a submission and its current file.
- **Upload Error Log**: Transient log of upload/storage failures.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of valid uploads attach the file to the submission.
- **SC-002**: 100% of invalid type uploads are rejected with a formats error.
- **SC-003**: 100% of oversize uploads are rejected with a size error.
- **SC-004**: 100% of upload failures allow retry without duplicate attachments.
- **SC-005**: 100% of storage failures show an error and do not attach the file.

### Non-Functional Requirements

- **NFR-001**: File validation feedback MUST respond within 200 ms (excluding upload time).
- **NFR-002**: Error messages MUST be accessible with semantic HTML and keyboard navigation.

## Clarifications

### Session 2026-02-01

- Q: Which exact file extensions are supported for Word/LaTeX? → A: `.docx`, `.pdf`, `.tex` only.
