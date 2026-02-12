# Feature Specification: Notify Editor of Assignment Rule Violations

**Feature Branch**: `015-notify-assignment-violations`  
**Created**: 2026-02-03  
**Status**: Draft  
**Input**: User description: "UC-15"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Notify violations for a single assignment (Priority: P1)

As an editor, I want to be notified when an assignment violates a rule, so I can
correct the issue and complete a valid assignment.

**Why this priority**: This is the core flow for enforcing assignment rules and
preventing invalid assignments.

**Independent Test**: Editor submits a single reviewer assignment that violates a
rule and receives a clear message explaining the violation and what to fix.
Additionally, when valid assignments are created, reviewers receive an email
request and can accept or reject it.

**Acceptance Scenarios**:

1. **Given** an editor is assigning one reviewer and the email is invalid,
   **When** the editor submits the assignment,
   **Then** the system blocks the assignment and shows a message explaining the
   invalid email.
2. **Given** an editor is assigning one reviewer and the reviewer has 5 active
   assignments,
   **When** the editor submits the assignment,
   **Then** the system blocks the assignment and shows a limit message.
3. **Given** an editor submits a valid assignment,
   **When** the assignment is created,
   **Then** the reviewer receives an email request; accept creates the assignment
   as active, reject leaves it unassigned and records the rejection.

---

### User Story 2 - Notify multiple violations and partial results (Priority: P2)

As an editor, I want to see all rule violations at once and which entries were
accepted or blocked, so I can fix issues efficiently in bulk assignments.

**Why this priority**: Bulk assignment is common and requires clear, complete
feedback to avoid repeated retries.

**Independent Test**: Editor submits multiple reviewers where some are valid and
some violate rules, and receives a per-entry summary of accepted vs blocked
assignments with reasons.

**Acceptance Scenarios**:

1. **Given** an editor submits multiple reviewers with mixed validity,
   **When** the system evaluates the request,
   **Then** the system reports all violations and identifies which entries were
   accepted and which were blocked.

---

### User Story 3 - Fail safely when evaluation or notification fails (Priority: P3)

As an editor, I want the system to fail safely when rule evaluation or
notification fails, so invalid assignments are not created and I receive a
usable error message.

**Why this priority**: Failure handling protects data integrity and avoids silent
invalid assignments.

**Independent Test**: Editor submits an assignment during a rule-evaluation or
notification failure and receives a blocking error message with guidance to
retry.

**Acceptance Scenarios**:

1. **Given** the system cannot evaluate assignment rules,
   **When** the editor submits the assignment,
   **Then** the system blocks the assignment and shows an error indicating the
   assignment cannot be completed at this time.
2. **Given** the notification UI fails to render,
   **When** a rule violation occurs,
   **Then** the system provides an alternate visible notification and still
   blocks invalid assignments.

---

### Traceability

- Use Case: UC-15
- Scenarios: S-15
- Acceptance Tests: AT-15 (AT-UC15-01 through AT-UC15-07)

## Clarifications

### Session 2026-02-03

- Q: Should bulk assignment use partial-apply or all-or-nothing behavior? → A: Partial-apply (save valid entries; block invalid ones with per-entry reasons)
- Q: Should notifications include email delivery? → A: Yes; send reviewer emails with accept/reject, accept creates assignment, reject leaves it unassigned
- Q: Are any assignment rule violations warnings-only? → A: No; all listed violations are blocking
- Q: Should failures be logged for admin review? → A: Log both rule-evaluation failures and notification-UI failures

### Edge Cases

- Multiple rule violations in a single request (report all).
- Duplicate reviewer entries in the same request.
- Assignment already exists for the same paper and reviewer.
- Notification UI failure with alternate visible feedback.
- Rule evaluation failure (fail safe).
- Email delivery failure or bounce for review request.
- Duplicate review requests for the same assignment.
- Concurrent accept/reject responses for the same request.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST validate assignment requests against defined rules
  before creating assignments.
- **FR-002**: The system MUST block invalid assignments and notify the editor of
  each rule violation with a clear, actionable message.
- **FR-003**: The system MUST report all detected violations in a request
  together (not one at a time).
- **FR-004**: The system MUST enforce workload limits (max 5 active assignments
  per reviewer) and notify the editor when the limit is reached.
- **FR-005**: The system MUST reject invalid reviewer emails and notify the
  editor of the invalid entries.
- **FR-006**: The system MUST prevent duplicate reviewer entries within the same
  request and notify the editor of duplicates.
- **FR-007**: The system MUST prevent duplicate assignments for the same
  paper-reviewer pair and notify the editor of the conflict.
- **FR-008**: The system MUST support partial-apply behavior for bulk requests,
  saving valid assignments while blocking invalid ones and reporting per-entry
  outcomes.
- **FR-009**: The system MUST fail safely when rule evaluation cannot be
  completed and notify the editor that the assignment cannot be completed at
  this time.
- **FR-010**: If the primary notification UI fails, the system MUST display an
  alternate visible error summary while still blocking invalid assignments.
- **FR-011**: The system MUST send reviewers an email request for each valid
  assignment and record accept/reject responses; acceptance creates the
  assignment, rejection leaves it unassigned.
- **FR-012**: The system MUST log rule-evaluation failures and notification-UI
  failures for administrator review.
- **FR-013**: The system MUST handle review-request email delivery failures by
  recording the failure, notifying the editor, and leaving the assignment
  unassigned.
- **FR-014**: The system MUST prevent duplicate review requests for the same
  assignment and ignore repeated accept/reject responses after resolution.

### Key Entities *(include if feature involves data)*

- **Reviewer**: A user eligible to review papers; referenced by email and ID.
- **Paper**: A submitted manuscript eligible for referee assignment.
- **Assignment**: The relationship between a reviewer and a paper.
- **Violation**: A rule violation tied to a reviewer entry and a reason.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of invalid assignment attempts present at least one visible
  violation message to the editor.
- **SC-002**: 100% of mixed-validity bulk requests return a per-entry outcome
  summary (accepted vs blocked) with reasons.
- **SC-003**: Editors can correct violations and successfully resubmit within
  2 attempts in at least 90% of cases.
- **SC-004**: 95% of assignment submissions return a visible response within
  200 ms under typical use.
- **SC-005**: 100% of evaluation failures result in blocked assignments with a
  clear retry message.
- **SC-006**: At least 95% of review-request emails are delivered and include
  working accept/reject actions.
- **SC-007**: 100% of rule-evaluation and notification-UI failures are logged
  for administrator review.

## Non-Functional Requirements

- **NFR-001**: Assignment notifications MUST appear within 200 ms under typical
  use.
- **NFR-002**: Notification messaging MUST be accessible via keyboard navigation
  with visible focus states.
- **NFR-003**: Email review requests MUST be sent within 2 minutes of a valid
  assignment being created.
- **NFR-004**: Review-request emails MUST be accessible (clear subject, readable
  content, and accessible links).

## Assumptions

- Notifications include in-app messages and reviewer emails for valid
  assignments.
- All listed assignment rules are blocking (no warnings-only rules).
- Papers are eligible for assignment and are not associated with a conference at
  assignment time.
- Email delivery is provided by an external service integrated with the CMS.
