# Feature Specification: Enter Manuscript Metadata

**Feature Branch**: `010-enter-manuscript-metadata`  
**Created**: 2026-02-01  
**Status**: Draft  
**Input**: User description: "UC-10"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enter Manuscript Metadata (Priority: P1)

A logged-in author enters complete manuscript metadata so the submission is fully
specified and can be processed in the review workflow.

**Why this priority**: Metadata is required for every submission and blocks progress
if missing or invalid.

**Independent Test**: A logged-in author fills all required fields and saves; invalid
or missing fields block saving with clear errors, and draft save preserves partial
entries.

**Acceptance Scenarios** (derived from `lab1_files/S-10.md` and `lab1_files/AT-10.md`):

1. **Given** an authenticated author on the submit paper form, **When** they view the metadata
   section, **Then** all required fields (authors, affiliations, contact info, abstract,
   keywords, main source) are visible and editable within the same form as upload and validation.
2. **Given** all required metadata is valid, **When** the author saves/submits, **Then** the
   system validates required fields and formats, stores metadata, confirms success, and
   reloading shows saved values.
3. **Given** partial metadata, **When** the author selects **Save Draft**, **Then** the system
   saves current values and confirms the draft was saved.
4. **Given** a required field is missing, **When** the author attempts final save/submit,
   **Then** the system rejects and identifies missing fields.
5. **Given** invalid contact information, **When** the author saves/submits, **Then** the system
   rejects and shows a contact info error.
6. **Given** invalid keywords, **When** the author saves/submits, **Then** the system rejects
   and shows a keywords error.
7. **Given** a database write failure, **When** the system attempts to save, **Then** it shows
   a save-unavailable error, logs the failure, and does not commit metadata changes.
8. **Given** a draft save with invalid contact email or keywords provided, **When** the author
   saves the draft, **Then** the system rejects the draft save and shows the relevant format error.

### Edge Cases

- Author uses multiple authors and affiliations with inconsistent separators (handled by FR-017).
- Author enters extremely long abstract text (bounded by FR-018).
- Author leaves keywords empty when attempting final save (handled by FR-009 and FR-011).

### Assumptions & Dependencies

- Required fields: author names, affiliations, contact email, abstract, keywords, main source.
- Draft saving is enabled and allows partial metadata.
- Metadata is editable only while submission is not finalized.
- Draft and final metadata persistence are available via the submission storage service.
- Logging for database failures is available (transient; no persistence required).
- Keyword validation enforces 1–10 keywords and standard comma-separated list format.
- Metadata entry is presented within the submit paper form alongside upload and validation controls
  (no separate metadata page required).

### Out of Scope

- Final submission workflow beyond metadata entry.
- Review workflow or reviewer assignment.
- Detailed field constraints beyond those explicitly stated.

### Traceability

- Use Case: `lab1_files/UC-10.md`
- Scenarios: `lab1_files/S-10.md`
- Acceptance Tests: `lab1_files/AT-10.md`

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display metadata fields for author names, affiliations, contact
  information, abstract, keywords, and main source.
- **FR-002**: System MUST validate that all required metadata fields are present for final
  save/submit.
- **FR-003**: System MUST validate contact information format (email).
- **FR-004**: System MUST validate keywords are 1–10 items and comma-separated.
- **FR-005**: System MUST save metadata to the submission when validation passes.
- **FR-006**: System MUST confirm successful metadata save.
- **FR-007**: System MUST allow saving partial metadata as a draft.
- **FR-008**: System MUST preserve draft metadata and allow reopening for edits.
- **FR-009**: If required fields are missing, system MUST show errors and block final save/submit.
- **FR-010**: If contact info is invalid, system MUST show an error and block save/submit.
- **FR-011**: If keywords are invalid, system MUST show an error and block save/submit.
- **FR-012**: If database write fails, system MUST show a save-unavailable error, log the failure
  (transient), and not commit metadata changes.
- **FR-013**: System MUST allow editing metadata only while the submission is not finalized.
- **FR-014**: Draft save MUST allow missing required fields, but MUST still validate formats for
  any provided contact email and keywords.
- **FR-015**: System MUST define acceptable values for main source as: file upload or external
  repository link.
- **FR-016**: Error messages for missing/invalid fields MUST identify the field and provide
  corrective guidance.
- **FR-017**: System MUST support multiple authors and affiliations, accepting comma or semicolon
  separators, and normalize to a consistent list on save.
- **FR-018**: Abstract length MUST be limited to 1–5000 characters; values beyond this MUST be
  rejected with an error.

### Key Entities *(include if feature involves data)*

- **Manuscript Metadata**: Author names, affiliations, contact info, abstract, keywords, main source.
- **Metadata Draft**: Partially completed metadata snapshot; created on first draft save, overwritten
  on subsequent draft saves, and discarded when final save/submit completes.
- **Metadata Error Log**: Transient log of save failures (no persistence).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of valid metadata saves persist values and show success.
- **SC-002**: 100% of missing required fields are rejected with clear errors.
- **SC-003**: 100% of invalid contact info entries are rejected with a format error.
- **SC-004**: 100% of invalid keywords are rejected with a keywords error.
- **SC-005**: 100% of database failures show save-unavailable error and do not commit changes.
- **SC-006**: 100% of saved drafts persist and can be reopened.

### Non-Functional Requirements

- **NFR-001**: Metadata validation feedback MUST respond within 200 ms from user action to on-screen
  feedback (end-to-end in the UI).
- **NFR-002**: Error messages and input fields MUST be accessible with semantic HTML and keyboard
  navigation.

## Clarifications

### Session 2026-02-01

- Q: What keyword validation rules apply? → A: 1–10 keywords, comma-separated.
