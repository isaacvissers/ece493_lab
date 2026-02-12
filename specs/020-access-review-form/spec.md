# Feature Specification: Access Review Form for Assigned Papers

**Feature Branch**: `020-access-review-form`  
**Created**: 2026-02-03  
**Status**: Draft  
**Input**: User description: "UC-20"

## Clarifications

### Session 2026-02-03

- Q: What happens when the review period is closed? → A: Review form is view-only;
  editing/submission is blocked.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Open review form for assigned paper (Priority: P1)

As a reviewer, I want to open the review form for an assigned paper so I can
begin or continue my evaluation.

**Why this priority**: Access to the review form is the core action required to
perform reviews.

**Independent Test**: From the assigned papers list, the reviewer can open the
review form for an accepted assignment and see the form ready for input.

**Acceptance Scenarios**:

1. **Given** a reviewer is logged in and has an accepted assignment,
   **When** the reviewer selects **Open Review Form** for the paper,
   **Then** the system displays the review form for that paper.
2. **Given** a reviewer has an accepted assignment with an existing draft,
   **When** the reviewer opens the review form,
   **Then** the system loads the saved draft into the form.
3. **Given** a reviewer’s session has expired,
   **When** the reviewer attempts to open the review form,
   **Then** the system prompts for login and returns the reviewer to the form
   after authentication.

---

### User Story 2 - Enforce authorization and review period rules (Priority: P2)

As a reviewer, I want clear access rules so I cannot open review forms for
papers I am not authorized to review or when the review period is closed.

**Why this priority**: Protects review integrity and prevents unauthorized
access.

**Independent Test**: Unassigned, unaccepted, or closed-period access attempts
are blocked with clear messages.

**Acceptance Scenarios**:

1. **Given** a reviewer attempts to open a review form for a paper they are not
   assigned to,
   **When** access is requested,
   **Then** the system denies access and shows an authorization error.
2. **Given** a reviewer has a pending or rejected assignment,
   **When** they attempt to open the review form,
   **Then** the system blocks access and indicates acceptance is required.
3. **Given** the review period is closed,
   **When** the reviewer opens the review form,
   **Then** the system allows view-only access and blocks editing/submission
   with a closed-period message.
4. **Given** the reviewer has no assigned papers eligible for review,
   **When** the reviewer opens **My Assigned Papers**,
   **Then** the system shows a \"no assigned papers\" message and provides
   navigation back to the dashboard.\n*** End Patch"]}

---

### User Story 3 - Handle missing form/data failures (Priority: P3)

As a reviewer, I want clear errors when the review form or data cannot be
loaded so I know what to do next.

**Why this priority**: Failures should not leave reviewers without feedback or
recovery options.

**Independent Test**: Missing form or retrieval failure shows a clear error and
is logged.

**Acceptance Scenarios**:

1. **Given** the review form configuration is unavailable,
   **When** the reviewer opens the form,
   **Then** the system shows a "form unavailable" error and logs the failure.
2. **Given** the system cannot load the form or draft from storage,
   **When** the reviewer opens the form,
   **Then** the system shows a load error, logs the failure, and allows retry.

---

### Traceability

- Use Case: UC-20
- Scenarios: S-20
- Acceptance Tests: AT-20 (AT-UC20-01 through AT-UC20-08)

### Edge Cases

- Reviewer session expired when opening the review form.
- No assigned papers available for review.
- Review period closed for viewing/editing.
- Review form configuration missing.
- Draft load fails from storage.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow reviewers with accepted assignments to open
  the review form for the selected paper.
- **FR-002**: The system MUST load any saved review draft when the form is
  opened.
- **FR-003**: The system MUST deny access to reviewers who are not assigned to
  the paper and show an authorization error.
- **FR-004**: The system MUST deny access when the assignment is pending or
  rejected and indicate acceptance is required.
- **FR-005**: The system MUST allow view-only access when the review period is
  closed and block editing/submission with a closed-period message.
- **FR-006**: The system MUST show a "form unavailable" error and log the
  failure if the review form configuration is missing.
- **FR-007**: The system MUST show a load error, log the failure, and allow
  retry when the form or draft cannot be retrieved.

### Key Entities *(include if feature involves data)*

- **ReviewForm**: The configured template/fields for a review.
- **ReviewDraft**: The reviewer’s saved in-progress review for a paper.
- **ReviewerAssignment**: Links a reviewer to a paper with assignment status.
- **Paper**: The manuscript being reviewed.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of authorized reviewers can open the review form for accepted
  assignments.
- **SC-002**: 100% of saved drafts are loaded when the review form is opened.
- **SC-003**: 100% of unauthorized access attempts are blocked with a clear
  error message.
- **SC-004**: 95% of review form loads complete in under 2 seconds.
- **SC-005**: 100% of form load failures are logged and surface a user-facing
  error.

## Non-Functional Requirements

- **NFR-001**: Review form retrieval MUST complete within 2 seconds under
  typical conditions.
- **NFR-002**: Review form errors MUST be keyboard accessible with visible focus
  states.

## Assumptions

- Reviewers must be authenticated to access the review form.
- Review period enforcement is enabled.
- Review drafts are supported and can be loaded.
