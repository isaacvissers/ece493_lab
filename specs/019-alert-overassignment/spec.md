# Feature Specification: Alert Editor on Reviewer Over-Assignment

**Feature Branch**: `019-alert-overassignment`  
**Created**: 2026-02-03  
**Status**: Draft  
**Input**: User description: "UC-19"

## Clarifications

### Session 2026-02-03

- Q: Should the system block over-assignment or allow and flag it? → A:
  Block over-assignment and alert immediately.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Alert on over-assignment (Priority: P1)

As an editor, I want an alert when a paper has more than three reviewers
assigned so I can correct the count immediately.

**Why this priority**: This is the core safeguard to keep reviewer counts within
policy.

**Independent Test**: When an assignment action would exceed three, the editor
is alerted with the current count and correction guidance.

**Acceptance Scenarios**:

1. **Given** a paper has three assigned reviewers,
   **When** the editor attempts to add another reviewer,
   **Then** the system blocks the assignment and alerts the editor that the
   count would exceed three.
2. **Given** a paper already has more than three reviewers,
   **When** the editor views the assignments,
   **Then** the system alerts the editor with the current count and guidance to
   correct it (remove/unassign, replace, or contact admin if unassign is not
   supported).

---

### User Story 2 - Handle batch assignment overages (Priority: P2)

As an editor, I want batch assignments to prevent over-assignment so I can
understand which additions caused the issue.

**Why this priority**: Batch actions are common and need clear, actionable
feedback when the policy is violated.

**Independent Test**: A batch add that would exceed three is partially applied
up to three, with the extra additions blocked and identified.

**Acceptance Scenarios**:

1. **Given** a batch assignment includes more reviewers than remaining slots,
   **When** the editor submits the batch,
   **Then** the system assigns up to three total and blocks the extra additions
   with an alert identifying which additions were rejected.
2. **Given** a batch assignment results in exactly three reviewers,
   **When** the editor submits the batch,
   **Then** the system confirms the count is correct without an alert.

---

### User Story 3 - Fail safely on count/alert failures (Priority: P3)

As an editor, I want clear errors when the reviewer count cannot be determined
or the alert UI fails so I can take corrective action.

**Why this priority**: Fail-safe behavior prevents silent policy violations.

**Independent Test**: Count lookup failures block assignment, show an error, and
are logged for review.

**Acceptance Scenarios**:

1. **Given** the system cannot determine the current reviewer count,
   **When** the editor attempts to assign a reviewer,
   **Then** the system blocks the assignment, alerts the editor, and logs the
   failure.
2. **Given** the alert UI cannot render,
   **When** an over-assignment is detected,
   **Then** the system logs the UI failure and provides an alternate error
   message while still blocking the over-assignment.

---

### Traceability

- Use Case: UC-19
- Scenarios: S-19
- Acceptance Tests: AT-19 (AT-UC19-01 through AT-UC19-08)

### Edge Cases

- Editor opens a paper that is already over-assigned.
- Batch assignment adds multiple reviewers at once.
- Reviewer count lookup fails (DB error).
- Alert UI fails to render.
- Editor cannot remove reviewers (unassign not supported).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST detect when a paper has more than three reviewers
  assigned and alert the editor with the current count and guidance for
  correction.
- **FR-002**: The system MUST block any assignment action that would result in
  more than three reviewers and alert the editor immediately.
- **FR-003**: The system MUST provide guidance actions to resolve over-assignments
  (remove/unassign, replace, or contact admin when removal is unavailable).
- **FR-004**: For batch assignment, the system MUST partially apply additions up
  to three and identify which additions were blocked.
- **FR-005**: The system MUST fail safely when reviewer count cannot be
  determined by blocking assignment, alerting the editor, and logging the
  failure.
- **FR-006**: If the alert UI fails to render, the system MUST log the failure
  and display an alternate error message while still blocking over-assignment.
- **FR-007**: The system MUST alert the editor when viewing an already
  over-assigned paper, even if no new assignment is attempted.

### Key Entities *(include if feature involves data)*

- **Paper**: The manuscript with reviewer assignments.
- **ReviewerAssignment**: Links a reviewer to a paper with assignment status.
- **Editor**: The authenticated editor performing assignment actions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of over-assignment attempts are blocked and alerted.
- **SC-002**: 100% of over-assigned papers viewed by an editor show an alert
  with the current count.
- **SC-003**: 100% of batch assignments that exceed three identify which
  additions were blocked.
- **SC-004**: 100% of count lookup failures are logged and block assignment.
- **SC-005**: 95% of assignment actions complete in under 2 seconds.

## Non-Functional Requirements

- **NFR-001**: Reviewer count checks MUST complete within 2 seconds under
  typical conditions.
- **NFR-002**: Alert and error messages MUST be keyboard accessible with visible
  focus states.

## Assumptions

- The policy is a maximum of three reviewers; assignments above three are not
  allowed and must be blocked.
- Editors can remove or replace reviewers; if not, the system provides admin
  contact guidance.
- Batch assignment is supported and uses partial-apply behavior for overages.
