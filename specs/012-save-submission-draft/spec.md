# Feature Specification: Save Submission Draft

**Feature Branch**: `012-save-submission-draft`  
**Created**: 2026-02-02  
**Status**: Draft  
**Input**: User description: "UC-12 make sure to use the correct name"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Save Draft Progress (Priority: P1)

An authenticated author saves submission progress at any step so work is not lost and can be resumed later with the latest saved state.

**Why this priority**: Draft saving is a high-frequency action that prevents data loss and enables completion over multiple sessions.

**Independent Test**: Author saves a partial draft, reopens it later, sees the latest changes, and can continue editing.

**Acceptance Scenarios** (derived from `lab1_files/S-12.md` and `lab1_files/AT-12.md`):

1. **Given** an authenticated author with partial submission data, **When** they click **Save Draft**, **Then** the system saves the current state and shows confirmation (or alternate “Last saved at” indicator).
2. **Given** a saved draft exists, **When** the author reopens it later, **Then** all previously saved values and any attached file are restored.
3. **Given** an existing draft, **When** the author saves again after edits, **Then** the latest state overwrites the previous draft and is restored on reopen.
4. **Given** incomplete or invalid final-submission fields, **When** the author clicks **Save Draft**, **Then** the system saves the draft and may warn about incomplete fields without blocking save.
5. **Given** a manuscript file is attached, **When** the author saves a draft, **Then** the file remains attached/linked when the draft is reopened.
6. **Given** a storage write failure on draft save, **When** the author clicks **Save Draft**, **Then** the system shows a save error, logs the failure, and does not overwrite the last saved draft.
7. **Given** the author’s session is expired, **When** they click **Save Draft**, **Then** the system redirects to login and returns them to the form to retry saving.
8. **Given** a draft retrieval failure, **When** the author attempts to open a draft, **Then** the system shows a load error, logs the failure, and prevents editing until retrieval succeeds.

### Edge Cases

- Draft saved without an attached manuscript file (covered by FR-006).
- Confirmation UI fails but draft saves successfully (alternate “Last saved at” indicator shown per FR-005).
- Author saves multiple times in rapid succession; latest state persists (covered by FR-002).

### Assumptions & Dependencies

- Draft saving is more permissive than final submission validation (incomplete/invalid final fields are allowed).
- Auto-save is not required.
- Drafts never expire unless deleted by the author or an administrator.
- Only the latest draft version is kept (no version history).
- File storage is available when a manuscript file is included in a draft, and the attachment reference is persisted with the draft state.
- Draft save/load depends on draft storage availability for the submission.
- Logging for save/load failures is available (transient; no persistence required).

### Out of Scope

- Auto-save frequency or background saving.
- Draft expiration or deletion policies.
- Version history for drafts.
- Final submission validation rules (handled in UC-11).

### Traceability

- Use Case: `lab1_files/UC-12.md`
- Scenarios: `lab1_files/S-12.md`
- Acceptance Tests: `lab1_files/AT-12.md`

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow an authenticated author to save the current submission state as a draft at any time.
- **FR-002**: System MUST persist the latest draft state, overwriting the prior draft for the same submission.
- **FR-003**: System MUST restore the latest saved draft state when reopened.
- **FR-004**: System MUST allow saving drafts with incomplete or invalid final-submission fields.
- **FR-005**: System MUST display a draft-saved confirmation or alternate “Last saved at” timestamp indicator after a successful save.
- **FR-006**: If a manuscript file is attached, system MUST persist the attachment reference in the draft.
- **FR-007**: If draft save fails, system MUST show an error and MUST NOT overwrite the last saved draft.
- **FR-008**: If draft save fails, system MUST log the failure for administrator review (transient).
- **FR-009**: If a session is expired, system MUST redirect to login and return the author to the submission form to retry saving.
- **FR-010**: If draft retrieval fails, system MUST show an error, log the failure, and prevent editing until retrieval succeeds.
- **FR-011**: System MAY warn the author about incomplete required fields on draft save without blocking save.
- **FR-012**: When draft retrieval fails, the submission form MUST be read-only until the draft loads successfully.

### Key Entities *(include if feature involves data)*

- **Draft Submission**: Partial submission state (metadata + optional file reference).
- **Draft Save State**: Latest saved snapshot for a submission.
- **Draft Error Log**: Transient log of save/load failures.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of draft saves persist the latest state and can be reopened.
- **SC-002**: 100% of draft saves with an attached file restore the attachment reference on reopen.
- **SC-003**: 100% of failed draft saves leave the previous saved state intact.
- **SC-004**: 100% of draft retrieval failures show an error and prevent editing.
- **SC-005**: 100% of successful draft saves show confirmation or alternate indicator.

### Non-Functional Requirements

- **NFR-001**: Draft save confirmation or alternate indicator MUST be shown within 200 ms from save action to on-screen feedback (end-to-end in the UI).
- **NFR-002**: Draft save and load feedback (errors and success indicators) MUST be accessible via semantic HTML and keyboard navigation.

## Clarifications

### Session 2026-02-02

- Q: Do drafts expire? → A: Drafts never expire unless deleted by the author or an administrator.
