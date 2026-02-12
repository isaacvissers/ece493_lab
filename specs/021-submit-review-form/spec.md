# Feature Specification: Submit Completed Review Form

**Feature Branch**: `021-submit-review-form`  
**Created**: 2026-02-03  
**Status**: Draft  
**Input**: User description: "UC-21"

## Clarifications

### Session 2026-02-03

- Q: Can reviewers edit/resubmit after submission? → A: No, submissions are final.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Submit completed review (Priority: P1)

As a reviewer, I want to submit my completed review so the editor can see my
evaluation and use it in the decision process.

**Why this priority**: Submission is the core outcome of the review workflow.

**Independent Test**: A valid review submission is saved and marked submitted,
with a confirmation shown to the reviewer.

**Acceptance Scenarios**:

1. **Given** a reviewer has a valid, completed review (all required fields
   present, no validation errors, and final submission confirmation checked),
   **When** they select **Submit Review**,
   **Then** the system validates and stores the review as submitted and shows
   a confirmation.
2. **Given** a review is already submitted,
   **When** the reviewer attempts to submit again,
   **Then** the system blocks duplicate submission and informs the reviewer that
   submissions are final.
3. **Given** notifications are enabled and a submission succeeds,
   **When** the editor notification fails,
   **Then** the system keeps the submission submitted, logs the notification
   failure, and shows a non-blocking warning.

---

### User Story 2 - Validate review input before submission (Priority: P2)

As a reviewer, I want clear validation feedback so I can fix errors before
submitting my review.

**Why this priority**: Validation prevents incomplete or invalid reviews from
being submitted.

**Independent Test**: Missing or invalid fields block submission with specific
messages.

**Acceptance Scenarios**:

1. **Given** required fields are missing or invalid (e.g., empty summary,
   missing recommendation, or rating out of range),
   **When** the reviewer submits the review,
   **Then** the system highlights fields, shows an error summary, and does not
   submit.
2. **Given** all required fields are valid,
   **When** the reviewer submits the review,
   **Then** the system proceeds with submission.

---

### User Story 3 - Handle submission failures and closed periods (Priority: P3)

As a reviewer, I want clear error handling if submission fails or the review
period is closed so I know what to do next.

**Why this priority**: Submission failures and deadlines must be communicated
clearly without losing data.

**Independent Test**: Closed period or save failure blocks submission, shows
error, and preserves draft.

**Acceptance Scenarios**:

1. **Given** the review period is closed,
   **When** the reviewer submits the review,
   **Then** the system blocks submission and shows a closed-period message while
   allowing view-only access (view content only; editing and submission are
   disabled).
2. **Given** the system cannot save the submitted review,
   **When** the reviewer submits the review,
   **Then** the system shows a submission error, logs the failure, and keeps
   the review in draft state.
3. **Given** the reviewer is not authorized to submit for the paper,
   **When** they attempt to submit,
   **Then** the system blocks submission and shows an authorization message
   explaining they are not assigned to this paper.
4. **Given** the reviewer session expires during submission,
   **When** they attempt to submit,
   **Then** the system blocks submission, preserves the draft, and prompts the
   reviewer to sign in again.

---

### Traceability

- Use Case: UC-21
- Scenarios: S-21
- Acceptance Tests: AT-21 (AT-UC21-01 through AT-UC21-08)

### Edge Cases

- Reviewer session expired during submission.
- Reviewer submits for an unauthorized paper.
- Duplicate submission attempt after success.
- Database write failure on submission.
- Notification failure after successful submission (optional).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST validate required review fields before allowing
  submission. Required fields are: overall recommendation, review summary,
  comments to authors, and confidence rating. If the ReviewForm includes
  additional required fields, those MUST be validated as well.
- **FR-002**: The system MUST store a submitted review and mark its status as
  **Submitted** when validation succeeds.
- **FR-003**: The system MUST block duplicate submissions and inform the
  reviewer if the review is already submitted; submissions are final.
- **FR-004**: The system MUST block submission when the review period is closed
  and allow view-only access to the draft (view content only; editing and
  submission are disabled).
- **FR-005**: The system MUST deny submission for unauthorized reviewers and
  show an authorization error that explains the reviewer is not assigned to the
  paper.
- **FR-006**: The system MUST show field-level errors and an error summary when
  validation fails. Validation rules include: non-empty text for required
  narrative fields, recommendation selected from allowed options, and confidence
  rating within the allowed range.
- **FR-007**: The system MUST show a submission error, log failures, and
  preserve draft state when saving fails.
- **FR-008**: If notifications are enabled, the system MUST notify the editor
  after successful submission and log notification failures.

### Key Entities *(include if feature involves data)*

- **ReviewForm**: The configured template/fields for a review.
- **ReviewDraft**: The reviewer’s saved in-progress review.
- **SubmittedReview**: The final submitted review record.
- **ReviewerAssignment**: Links a reviewer to a paper with assignment status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of valid submissions are stored and marked submitted.
- **SC-002**: 100% of validation failures show field-level errors and an error
  summary.
- **SC-003**: 100% of duplicate submission attempts are blocked with a clear
  message.
- **SC-004**: 95% of submission actions complete in under 200 ms.
- **SC-005**: 100% of submission failures are logged and preserve draft state.

## Non-Functional Requirements

- **NFR-001**: Submission interactions MUST respond within 200 ms under typical
  conditions and avoid blocking the reviewer’s ability to continue interacting
  with the page.
- **NFR-002**: Submission errors MUST be keyboard accessible with visible focus
  states.

## Assumptions

- Review drafts are supported and preserved on failure.
- Review period enforcement is enabled.
- Notifications to editors are optional and may be disabled.
