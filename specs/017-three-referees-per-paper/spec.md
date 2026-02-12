# Feature Specification: Ensure Exactly Three Referees per Paper

**Feature Branch**: `017-three-referees-per-paper`  
**Created**: 2026-02-03  
**Status**: Draft  
**Input**: User description: "UC-17"

## Clarifications

### Session 2026-02-03

- Q: Which assignments count toward the "exactly three referees" rule? → A:
  All assignments that are not declined, including pending invitations.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enforce exactly three referees before review (Priority: P1)

As an editor, I want the system to require exactly three referees before a paper
can enter review, so the review process has sufficient coverage and stays within
policy.

**Why this priority**: This is the core enforcement that allows the review
workflow to proceed only when staffing is correct.

**Independent Test**: Paper at review checkpoint is blocked when it has 2 or 4
referees and allowed when it has exactly 3.

**Acceptance Scenarios**:

1. **Given** a paper is at the review readiness checkpoint with exactly three
   non-declined referee assignments (including pending invitations),
   **When** the system evaluates readiness,
   **Then** the paper is marked ready for review and the workflow proceeds.
2. **Given** a paper has fewer than three non-declined referee assignments,
   **When** readiness is evaluated,
   **Then** the system blocks progression and notifies the editor of the
   current count.
3. **Given** a paper has more than three non-declined referee assignments,
   **When** readiness is evaluated,
   **Then** the system blocks progression and notifies the editor of the
   current count.

---

### User Story 2 - Guide editor to resolve referee count issues (Priority: P2)

As an editor, I want clear guidance to add or remove referees when the paper has
an incorrect count, so I can fix the issue quickly.

**Why this priority**: Editors need actionable guidance to resolve violations.

**Independent Test**: When count is not three, the system provides a clear
message and a link/action to adjust assignments.

**Acceptance Scenarios**:

1. **Given** a paper has fewer than three non-declined referee assignments,
   **When** the system blocks readiness,
   **Then** it provides a link/action to assign additional referees.
2. **Given** a paper has more than three non-declined referee assignments,
   **When** the system blocks readiness,
   **Then** it provides a link/action to remove or replace a referee (if
   supported).

---

### User Story 3 - Fail safely when count cannot be determined (Priority: P3)

As an editor, I want the system to fail safely if it cannot determine the
referee count, so it does not allow review to start in an invalid state.

**Why this priority**: Data reliability failures must not allow invalid review
progression.

**Independent Test**: A lookup failure blocks readiness, shows an error, and is
logged for admin review.

**Acceptance Scenarios**:

1. **Given** the system cannot determine the current referee count,
   **When** readiness is evaluated,
   **Then** the system blocks progression, notifies the editor, and logs the
   failure.

---

### Traceability

- Use Case: UC-17
- Scenarios: S-17
- Acceptance Tests: AT-17 (AT-UC17-01 through AT-UC17-07)

### Edge Cases

- Editor attempts to assign a fourth referee.
- Invitations not sent to all three referees.
- Count evaluation occurs during concurrent assignment changes.
- Missing assignment records or lookup failure.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST require exactly three non-declined referee
  assignments (including pending invitations) before a paper can enter the
  review stage. Non-declined assignments are those with status `pending` or
  `accepted`; `declined` and `withdrawn` assignments do not count.
- **FR-002**: The system MUST block review progression when the paper has fewer
  than three non-declined referee assignments and notify the editor of the
  current count.
- **FR-003**: The system MUST block review progression when the paper has more
  than three non-declined referee assignments and notify the editor of the
  current count.
- **FR-004**: The system MUST provide an action to add referees when fewer than
  three are assigned.
- **FR-005**: The system MUST provide an action to remove or replace referees
  when more than three are assigned (if removal/replacement is supported).
- **FR-006**: The system MUST fail safely when referee count cannot be
  determined, notify the editor, and log the failure.
- **FR-007**: The system MUST prevent assignment of a fourth referee and notify
  the editor of the policy.
- **FR-008**: The system MUST record readiness decisions for audit purposes.
- **FR-009**: If referee invitations are enabled, the system MUST flag missing
  invitations when exactly three non-declined referee assignments exist. A
  "missing invitation" means a non-declined assignment has no invitation record
  in `pending`, `accepted`, or `rejected` state.

### Readiness Checkpoint Definition

- The readiness checkpoint occurs immediately before a paper transitions from
  `eligible` to `in_review`, initiated by an editor's "Start review" action.
- The system MUST evaluate the latest assignment state at the moment of the
  checkpoint; if concurrent changes are detected during evaluation, the system
  MUST block progression and instruct the editor to retry.

### Key Entities *(include if feature involves data)*

- **Paper**: The submitted manuscript in review.
- **RefereeAssignment**: A mapping of a referee to a paper.
- **RefereeInvitation**: Invitation status for a referee (if enabled).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of readiness checks block progression unless the referee
  count is exactly three.
- **SC-002**: 100% of readiness failures present the current referee count to
  the editor.
- **SC-003**: 100% of count lookup failures are logged and block progression.
- **SC-004**: 95% of readiness checks complete in under 2 seconds.
- **SC-005**: 100% of attempts to add a fourth referee are blocked.

## Non-Functional Requirements

- **NFR-001**: Readiness evaluation MUST complete within 2 seconds under
  typical conditions.
- **NFR-002**: Readiness error messages MUST be accessible via keyboard
  navigation with visible focus states.

## Assumptions

- The policy is exactly three non-declined referee assignments (pending or
  accepted only).
- Editors can access assignment controls to adjust referee count.
- Invitations are optional and may be disabled.
