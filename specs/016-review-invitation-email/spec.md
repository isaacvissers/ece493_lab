# Feature Specification: Receive Review Invitation by Email

**Feature Branch**: `016-review-invitation-email`  
**Created**: 2026-02-03  
**Status**: Draft  
**Input**: User description: "UC-16"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Receive and respond to invitation (Priority: P1)

As a reviewer, I want to receive an invitation email with accept/reject links,
so I can respond to the review request and the system records my decision.

**Why this priority**: This is the primary reviewer workflow that enables the
review process to proceed.

**Independent Test**: Reviewer receives an invitation email, clicks accept, and
sees confirmation that the response is recorded; assignment status updates to
accepted.

**Acceptance Scenarios**:

1. **Given** a reviewer is invited to review a paper,
   **When** the reviewer receives the invitation email,
   **Then** the email contains paper identification, role context, and accept/
   reject links.
2. **Given** a reviewer clicks **Accept** from the invitation email,
   **When** the system records the response,
   **Then** the assignment status becomes accepted and confirmation is shown.
3. **Given** a reviewer clicks **Reject** from the invitation email,
   **When** the system records the response,
   **Then** the assignment status becomes rejected and confirmation is shown.

---

### User Story 2 - Handle invalid or expired links (Priority: P2)

As a reviewer, I want to be informed if an invitation link is invalid or
expired, so I can request a new invitation.

**Why this priority**: Link failures are a common edge case and must not create
silent failures.

**Independent Test**: Reviewer clicks an invalid or expired link and receives a
clear error with guidance to request a new invitation.

**Acceptance Scenarios**:

1. **Given** a reviewer clicks an invalid or expired invitation link,
   **When** the system validates the link,
   **Then** the system shows an error indicating the link is invalid/expired
   and no response is recorded.
2. **Given** a reviewer attempts to respond twice to the same invitation,
   **When** the system detects a recorded response,
   **Then** the system informs the reviewer the response is already recorded
   and does not change the recorded decision.

---

### User Story 3 - Fail safely on send or record failures (Priority: P3)

As a reviewer or editor, I want the system to fail safely when invitations cannot
be sent or responses cannot be recorded, so assignments remain consistent.

**Why this priority**: Reliability prevents orphaned invitations and missing
responses.

**Independent Test**: A send failure or record failure occurs and the system
logs the failure, leaves the assignment unchanged, and shows an appropriate
error message.

**Acceptance Scenarios**:

1. **Given** the notification service fails to send the invitation,
   **When** the system attempts delivery,
   **Then** the invitation remains pending, the editor is notified, and the
   failure is logged.
2. **Given** a reviewer responds but the system cannot record the response,
   **When** the response is submitted,
   **Then** the system shows an error, logs the failure, and the assignment
   status remains unchanged.

---

### Traceability

- Use Case: UC-16
- Scenarios: S-16
- Acceptance Tests: AT-16 (AT-UC16-01 through AT-UC16-08)

### Edge Cases

- Missing or malformed reviewer email.
- Invitation delivered but not seen (no response).
- Duplicate response attempts.
- Invitation resend after timeout.
- Invalid/expired links.
- Database write failure on response.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST generate a review invitation tied to a paper and
  reviewer.
- **FR-002**: The system MUST send an invitation email containing paper
  identification, role context, and accept/reject links.
- **FR-003**: The system MUST record reviewer responses and update assignment
  status to accepted or rejected accordingly.
- **FR-004**: The system MUST display confirmation after a reviewer responds.
- **FR-005**: The system MUST handle invalid or expired links by showing an
  error and not recording a response.
- **FR-006**: The system MUST detect and prevent duplicate responses, informing
  the reviewer that a response is already recorded.
- **FR-007**: The system MUST fail safely when invitation delivery fails by
  keeping the invitation pending, notifying the editor, and logging the failure.
- **FR-008**: The system MUST fail safely when recording a response fails by
  showing an error, logging the failure, and leaving assignment status unchanged.
- **FR-009**: The system MUST allow resending invitations when no response is
  received within 7 days.

### Key Entities *(include if feature involves data)*

- **ReviewInvitation**: An invitation tied to a reviewer and paper with status.
- **Reviewer**: The person invited to review.
- **Paper**: The submitted manuscript.
- **Assignment**: The review assignment status (pending/accepted/rejected).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of invitations are delivered with valid accept/reject links
  within 2 minutes of assignment creation.
- **SC-002**: 100% of reviewer responses are recorded with correct status when
  links are valid.
- **SC-003**: 100% of invalid/expired links display an error and record no
  response.
- **SC-004**: 100% of send/record failures are logged and do not alter
  assignment status.
- **SC-005**: Reviewers see a confirmation page within 2 seconds after
  responding in 95% of cases.

## Non-Functional Requirements

- **NFR-001**: Invitation email delivery MUST occur within 2 minutes under
  typical conditions.
- **NFR-002**: Reviewer response pages MUST be accessible via keyboard
  navigation with visible focus states.
- **NFR-003**: Invitation links MUST be single-use and expire after a defined
  period of 7 days.

## Assumptions

- Invitations are delivered via an external email service.
- Reviewers are not required to log in before responding.
