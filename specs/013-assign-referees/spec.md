# Feature Specification: Assign Referees to Submitted Papers

**Feature Branch**: `013-assign-referees`  
**Created**: 2026-02-02  
**Status**: Draft  
**Input**: User description: "Assign referees to submitted papers"

## Clarifications

### Session 2026-02-02

- Q: Are referee notifications part of this feature? → A: Notifications are required and must be sent to assigned referees.
- Q: How many referees are required per paper? → A: Exactly 3 referees.
- Q: Which roles can assign referees? → A: Only Editors can assign referees.
- Q: What happens if the editor provides fewer or more than three referees? → A: Block submission if count is not exactly three.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Assign referees to an eligible submitted paper (Priority: P1)

An editor selects a submitted paper, enters exactly three referee email addresses, and confirms the assignment so the paper can proceed to review.

**Why this priority**: This is the core business goal of UC-13 and enables the review process to start.

**Independent Test**: Can be fully tested by assigning referees to a submitted paper and verifying the assigned referee list updates and a confirmation is shown.

**Acceptance Scenarios** (UC-13, S-13, AT-13: AT-UC13-01, AT-UC13-10):

1. **Given** an editor is logged in and a paper is in Submitted status, **When** the editor assigns exactly three valid referee email addresses, **Then** the system records the assignments and confirms success.
2. **Given** valid referee emails are entered, **When** the editor confirms assignment, **Then** the paper’s referee list reflects the assigned referees and notifications are sent to those referees.
3. **Given** assignments are saved successfully but notification delivery fails, **When** the system attempts to notify referees, **Then** assignments remain saved and a warning is shown.
4. **Given** a save failure occurs after validation, **When** the editor confirms assignment, **Then** no assignments are recorded and the editor is prompted to retry.

---

### User Story 2 - Block assignment when editor permissions or eligibility are missing (Priority: P2)

A user who is not an editor or a paper that is not eligible for assignment cannot proceed with assigning referees.

**Why this priority**: Protects role-based access and avoids invalid assignments that would undermine workflow integrity.

**Independent Test**: Can be fully tested by attempting to access assignment as a non-editor or with an ineligible paper and observing access is denied with a clear message.

**Acceptance Scenarios** (UC-13 extensions 1a, 2a; S-13; AT-13: AT-UC13-02, AT-UC13-03, AT-UC13-04):

1. **Given** a user is not logged in, **When** they attempt to access referee assignment, **Then** they are redirected to login.
2. **Given** a logged-in user lacks editor permissions, **When** they attempt to assign referees, **Then** the system denies access with an authorization message.
3. **Given** a paper is not eligible for assignment, **When** an editor tries to assign referees, **Then** the system blocks the action and explains why.

---

### User Story 3 - Validate referee email inputs and prevent duplicates (Priority: P3)

An editor receives clear feedback when referee email entries are missing, invalid, or duplicated so only valid, unique assignments are created.

**Why this priority**: Ensures assignment data quality and reduces administrative cleanup.

**Independent Test**: Can be fully tested by submitting blank, invalid, or duplicate emails and verifying the system blocks or de-duplicates appropriately.

**Acceptance Scenarios** (UC-13 extensions 6a, 7a, 7b, 8a; S-13; AT-13: AT-UC13-05 to AT-UC13-08):

1. **Given** one or more referee email fields are blank, **When** the editor confirms assignment, **Then** the system blocks the assignment and highlights the missing email.
2. **Given** one or more referee email addresses are invalid, **When** the editor confirms assignment, **Then** the system blocks the assignment and identifies invalid entries.
3. **Given** duplicate referee emails are entered, **When** the editor confirms assignment, **Then** the system blocks the assignment, identifies the duplicates, and requires three unique emails.
4. **Given** a referee is already assigned to the paper, **When** the editor re-enters that email, **Then** the system rejects the duplicate and prompts the editor to enter a different referee to reach three unique emails.

---

### Edge Cases

- Save fails after validation: no assignments recorded; editor stays on form and can retry.
- Notification delivery fails: assignments remain; warning shown; failure logged.
- Editor provides fewer or more than three referees: submission blocked with count-specific error.
- Duplicate emails with case/whitespace variation: treated as duplicates.
- Multiple validation errors at once: all errors are shown together.
- Session expires mid-flow: redirect to login and return to the same paper on success.
- Editor role revoked mid-flow: submission blocked with authorization error.
- Concurrent assignment detected: submission blocked with “assignment changed, refresh” message.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST require exactly three referee email addresses for assignment to a paper in Submitted status. 
- **FR-002**: System MUST restrict referee assignment to users with editor permissions and require authentication; if the editor role is missing at submission time, the system MUST block assignment and show an authorization error.
- **FR-003**: System MUST allow assignments only when a paper status is **Submitted**; statuses such as Withdrawn, Under Review, Accepted, Rejected, or Finalized are ineligible.
- **FR-004**: System MUST require each of the three referee emails to be non-blank and valid in format before assignment can proceed.
- **FR-006**: System MUST ignore or remove duplicate referee email entries and prevent duplicate assignments to the same paper.
- **FR-007**: System MUST save referee assignments atomically so that on a save failure no partial assignments are recorded.
- **FR-009**: System MUST send email notifications to assigned referees after a successful assignment.
- **FR-010**: System MUST warn the editor when notifications fail while keeping assignments intact.
- **FR-011**: System MUST treat referee email uniqueness as case-insensitive and ignore leading/trailing whitespace.
- **FR-012**: System MUST block assignment when duplicate handling results in fewer than three unique referees.
- **FR-013**: System MUST block assignment if concurrent changes are detected and prompt the editor to refresh the paper.
- **FR-015**: System MUST require a valid email format defined as: one “@”, non-empty local part, non-empty domain, at least one “.” in the domain, and no spaces.
- **FR-016**: System MUST show all validation errors together when multiple issues are present.
- **FR-017**: System MUST redirect to login on session expiry and return the editor to the same paper after re-authentication.
- **FR-018**: System MUST show a success confirmation that includes the paper identifier and the three assigned referee emails.
- **FR-019**: System MUST display an authorization message: “You do not have permission to assign referees.” in the assignment view banner area.
- **FR-020**: System MUST display a count error message: “Exactly 3 referees are required.” near the referee email inputs when count is incorrect.
- **FR-021**: System MUST show notification warnings in the assignment view banner area and log the failure for later review.
- **FR-022**: System MUST retry failed notifications once within 5 minutes before final failure.
- **FR-023**: Assignment interactions MUST respond within 200 ms for validation and confirmation actions.
- **FR-024**: Assignment form and messages MUST be accessible via keyboard and expose visible focus states.
- **FR-025**: Referee email addresses MUST be treated as sensitive and not shown outside the assignment view except in the assignment confirmation.

### Key Entities *(include if feature involves data)*

- **Paper**: A submitted manuscript with a status that determines eligibility for referee assignment.
- **Referee Assignment**: A linkage between a paper and a referee email address indicating review responsibility; the **Referee List** is the set of these assignments for a paper.
- **User (Editor)**: A registered user with editor permissions who can manage assignments.

### Assumptions

- Referee assignment is keyed by email address; referees do not need an existing account to be assigned.
- Unassigning or replacing referees is out of scope for this feature.
- An “eligible submitted paper” means a paper whose status is **Submitted**.
- Eligibility status is determined by the paper’s stored status field in the system.
- Storage uses browser localStorage with an in-memory cache (simulated CMS database).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 95% of editor assignment attempts for eligible papers complete successfully on the first try.
- **SC-002**: Editors can complete a referee assignment for an eligible paper in under 2 minutes from opening the assignment form.
- **SC-003**: 100% of invalid or blank referee email entries are blocked with a clear error message.
- **SC-004**: Duplicate referee assignments to the same paper are prevented in all tested scenarios.
