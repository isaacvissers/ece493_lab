# Feature Specification: Enforce Reviewer Assignment Limit

**Feature Branch**: `014-enforce-reviewer-limit`  
**Created**: 2026-02-03  
**Status**: Draft  
**Input**: User description: "UC-14"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Assign a reviewer within the limit (Priority: P1)

As an editor, I want to assign a reviewer to a paper when they are below the
assignment limit, so I can complete reviewer assignment without delays.

**Why this priority**: This is the primary workflow for assigning referees and
must work reliably to keep the review process moving.

**Independent Test**: Editor assigns a reviewer with 4 active assignments to an
eligible paper and receives a successful confirmation.

**Acceptance Scenarios**:

1. **Given** an editor is logged in and a reviewer has 4 active assignments,
   **When** the editor assigns that reviewer to an eligible paper,
   **Then** the assignment is accepted and the reviewer now has 5 assignments.
2. **Given** an editor is logged in and a reviewer has 5 active assignments,
   **When** the editor attempts to assign that reviewer to an eligible paper,
   **Then** the assignment is blocked with a clear limit message.
3. **Given** two editors attempt near-simultaneous assignments for a reviewer
   who has 4 active assignments,
   **When** both assignments are attempted,
   **Then** at most one assignment succeeds and the reviewer ends with 5
   assignments.

---

### User Story 2 - Assign multiple reviewers with mixed eligibility (Priority: P2)

As an editor, I want to assign multiple reviewers at once and get clear outcomes
for each reviewer, so I can resolve conflicts quickly when some are at the limit.

**Why this priority**: Bulk assignment is a common workflow and must provide
clear, actionable feedback when some reviewers cannot be assigned.

**Independent Test**: Editor submits a multi-reviewer assignment where one
reviewer is under the limit and one is at the limit, and receives a summary
indicating which assignments were accepted or blocked.

**Acceptance Scenarios**:

1. **Given** an editor is assigning multiple reviewers and at least one reviewer
   is under the limit while another is at the limit,
   **When** the editor submits the assignment,
   **Then** the system records only the allowed assignments and reports which
   reviewers were blocked due to the limit.

---

### User Story 3 - Fail safely on lookup or save failures (Priority: P3)

As an editor, I want assignments blocked when the system cannot verify limits or
save the assignment, so over-assignment and inconsistent data are avoided.

**Why this priority**: Safety and data integrity prevent unfair workload and
administrative cleanup.

**Independent Test**: Editor attempts an assignment while the system cannot
determine the reviewer’s current count or cannot save the assignment, and the
system blocks the assignment with an error message.

**Acceptance Scenarios**:

1. **Given** the system cannot determine a reviewer’s current assignment count,
   **When** the editor attempts the assignment,
   **Then** the system blocks the assignment and shows an error message.
2. **Given** the system verifies the reviewer is under the limit,
   **When** the assignment cannot be saved,
   **Then** the system reports the failure and does not create the assignment.

---

### Traceability

- Use Case: UC-14
- Scenarios: S-14
- Acceptance Tests: AT-14 (AT-UC14-01 through AT-UC14-07)

## Clarifications

### Session 2026-02-03

- Q: Should bulk assignments allow partial success or require all-or-nothing? → A: Partial apply (assign eligible reviewers; block those at/over limit)
- Q: What scope does the 5-paper limit apply across? → A: Global across all papers in the system (no conference association at assignment time)
- Q: Which assignments count toward the limit? → A: Active assignments only
- Q: Are overrides allowed for the 5-paper cap? → A: No overrides allowed
- Q: Should papers be associated with a conference at this step? → A: No, papers have no conference association at assignment time

### Edge Cases

- Reviewer has exactly 5 assignments (boundary condition).
- Reviewer assignment count cannot be determined (lookup failure).
- Two editors assign the same reviewer at nearly the same time.
- Bulk assignment includes both eligible and ineligible reviewers.
- Assignment save fails after passing the limit check.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST enforce a maximum of 5 active assignments per
  reviewer at the time of assignment, counting only active assignments.
- **FR-002**: The system MUST allow assignments when a reviewer has fewer than 5
  active assignments.
- **FR-003**: The system MUST block assignments that would result in more than 5
  active assignments for a reviewer and display a limit message that states the
  reviewer has reached the maximum of 5 active assignments.
- **FR-004**: The system MUST block assignments when the reviewer’s assignment
  count cannot be determined and display a clear error message.
- **FR-005**: The system MUST prevent partial or inconsistent records if saving
  the assignment fails and display a save-failure message indicating the
  assignment was not saved and can be retried.
- **FR-006**: The system MUST support assigning multiple reviewers in one action
  and apply partial success (assign eligible reviewers; block those at/over
  limit) with a summary of which assignments succeeded or were blocked.
- **FR-007**: The system MUST ensure concurrent assignment attempts do not allow
  a reviewer to exceed 5 active assignments.
- **FR-008**: The system MUST not allow overrides of the 5-assignment cap for any role.

### Key Entities *(include if feature involves data)*

- **Reviewer**: A user eligible to review papers; has a count of active assigned
  papers.
- **Paper**: A submitted manuscript eligible for referee assignment.
- **Assignment**: The relationship between a reviewer and a paper.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 95% of valid assignment attempts for reviewers under the
  limit complete successfully on the first try.
- **SC-002**: 100% of assignment attempts that would exceed the limit are
  blocked with a clear user-facing message.
- **SC-003**: In concurrent assignment attempts, the final reviewer assignment
  count never exceeds 5.
- **SC-004**: Editors can complete a single reviewer assignment in under
  2 minutes in a normal workflow.
- **SC-005**: For bulk assignment, the system provides a clear per-reviewer
  outcome summary in 100% of mixed-eligibility cases.
- **SC-006**: 95% of assignment actions return a visible result to the editor
  within 200 ms under typical use.

## Non-Functional Requirements

- **NFR-001**: Assignment actions MUST provide a visible response within 200 ms
  under typical use.
- **NFR-002**: The assignment interface MUST be keyboard operable with visible
  focus states for all interactive elements.

## Assumptions

- Papers are not associated with a conference at assignment time; the limit
  applies globally across all papers in the system.
- Withdrawn or completed reviews do not count toward the active assignment
  limit.
- Editors cannot override the assignment limit without an explicit future policy
  change.
