# Feature Specification: Make Final Accept/Reject Decision

**Feature Branch**: `024-final-decision`
**Created**: 2026-02-03
**Status**: Draft
**Input**: User description: "UC-24"

## Clarifications

### Session 2026-02-03

- Q: Should the decision require exactly 3 reviews or allow more? → A: Require exactly 3 reviews (only 3 reviewers are assigned per prior specs).
- Q: Can editors revise a decision after saving? → A: Decisions are final; only an administrator can reset.
- Q: Are decision comments required? → A: Decision comments are optional.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Decide on eligible papers (Priority: P1)

As an editor, I can make a final accept or reject decision for a paper that has exactly three completed reviews so the paper advances to the next workflow step.

**Why this priority**: Final decisions are the core outcome of the review process and unblock scheduling or rejection.

**Independent Test**: Can be tested by opening a paper with exactly three completed reviews and saving an Accept/Reject decision.

**Acceptance Scenarios**:

1. **Given** a paper has exactly three completed reviews, **When** the editor selects Accept and saves, **Then** the decision is stored and the paper status becomes Accepted. (Trace: UC-24 Main, S-24 Main, AT-UC24-03)
2. **Given** a paper has exactly three completed reviews, **When** the editor selects Reject and saves, **Then** the decision is stored and the paper status becomes Rejected. (Trace: UC-24 Main, S-24 Main, AT-UC24-04)

---

### User Story 2 - Eligibility and input validation (Priority: P2)

As an editor, I can only make decisions for papers that meet prerequisites so incorrect or unauthorized decisions are blocked.

**Why this priority**: Decision integrity depends on enforcing prerequisites and authorization.

**Independent Test**: Can be tested by attempting decisions with too few/many reviews, missing selection, or unauthorized access.

**Acceptance Scenarios**:

1. **Given** a paper has fewer than three completed reviews, **When** the editor attempts to decide, **Then** the system blocks decision entry and shows the current review count. (Trace: UC-24 3a, S-24 3a, AT-UC24-05)
2. **Given** a paper has more than three completed reviews, **When** the editor attempts to decide, **Then** the system blocks decision entry and flags the inconsistency. (Trace: UC-24 3b, S-24 3b, AT-UC24-06)
3. **Given** the editor does not have permission, **When** they attempt to decide, **Then** access is denied and the attempt is logged. (Trace: UC-24 8a, S-24 8a, AT-UC24-07)
4. **Given** no decision value is selected, **When** the editor submits, **Then** the system blocks saving and prompts for Accept or Reject. (Trace: UC-24 7a, S-24 7a, AT-UC24-08)

---

### User Story 3 - Failure handling and notifications (Priority: P3)

As an editor, I need decision saving to be reliable and resilient to failures so decisions are not lost or corrupted.

**Why this priority**: System failures must not corrupt decision state or block recovery.

**Independent Test**: Can be tested by simulating DB write failures and notification failures.

**Acceptance Scenarios**:

1. **Given** a database write failure occurs during decision save, **When** the editor submits, **Then** the decision is not saved and the paper status remains unchanged. (Trace: UC-24 9a, S-24 9a, AT-UC24-09)
2. **Given** notification sending fails after a decision is saved, **When** the system notifies authors, **Then** the decision remains stored and the failure is logged. (Trace: UC-24 11a, S-24 11a, AT-UC24-10)

---

### Edge Cases

- What happens when a paper has fewer than three completed reviews?
- What happens when a paper has more than three completed reviews?
- What happens when the editor is unauthorized to decide?
- What happens when the editor submits without choosing Accept/Reject?
- What happens when the decision save fails?
- What happens when author notification fails after save?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST show a decision queue that includes only papers with exactly three completed reviews.
- **FR-002**: System MUST display the three completed reviews before allowing a decision to be saved.
- **FR-003**: System MUST require the editor to choose Accept or Reject before saving a decision.
- **FR-004**: System MUST validate that exactly three completed reviews exist at decision time.
- **FR-005**: System MUST block decision entry if fewer or more than three completed reviews are present and show the current review count.
- **FR-006**: System MUST enforce authorization so only the assigned/authorized editor can decide.
- **FR-007**: System MUST persist the final decision and update paper status to Accepted or Rejected atomically.
- **FR-008**: System MUST show a confirmation when a decision is saved successfully.
- **FR-009**: System MUST log authorization failures and decision save failures.
- **FR-010**: System MUST keep paper status unchanged if decision save fails.
- **FR-011**: If enabled, the system MUST notify authors after a decision is saved; notification failure MUST NOT roll back the decision.
- **FR-012**: System MUST prevent additional decisions once a final decision is saved; only an administrator can reset the decision.

### Key Entities *(include if feature involves data)*

- **Paper**: Submission under review, status, assigned editor.
- **Review**: Completed review content and status linked to a paper.
- **Decision**: Final Accept/Reject value, optional comments, timestamps, and editor reference.
- **Notification**: Optional author notification event linked to a decision.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of eligible decisions save and update paper status within 30 seconds of submission.
- **SC-002**: 100% of decision attempts with fewer or more than three completed reviews are blocked.
- **SC-003**: 100% of decision submissions without Accept/Reject selected are blocked with a prompt.
- **SC-004**: 100% of decision save failures leave the paper status unchanged.

## Non-Functional Requirements

- **NFR-001**: Decision submission interactions MUST respond within 200 ms on a typical development laptop.
- **NFR-002**: Decision entry UI MUST be keyboard accessible with visible focus states.

## Assumptions

- Exactly three completed reviews are required for a decision (not “at least three”), because only 3 reviewers are assigned per prior specs.
- Decision comments are optional.
- A saved decision is final; only an administrator can reset it.
- Author notifications are optional and configured at the conference level.
