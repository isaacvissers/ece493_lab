# Feature Specification: View Accepted Assigned Paper in Reviewer Account

**Feature Branch**: `018-view-assigned-paper`  
**Created**: 2026-02-03  
**Status**: Draft  
**Input**: User description: "UC-18"

## Clarifications

### Session 2026-02-03

- Q: Should accepted assignments appear immediately or after a delay? → A:
  Immediately on the next list load/refresh (no batching).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View accepted assignments list (Priority: P1)

As a reviewer, I want accepted review assignments to appear in my assigned
papers list so I can access the papers I agreed to review.

**Why this priority**: This is the core visibility requirement that enables the
reviewer to find their assigned work.

**Independent Test**: After acceptance, the paper appears in the reviewer’s
assigned list and is visible on refresh.

**Acceptance Scenarios**:

1. **Given** a reviewer has accepted a valid invitation,
   **When** the reviewer opens the assigned papers list,
   **Then** the accepted paper appears in the list.
2. **Given** an accepted paper is newly added,
   **When** the reviewer refreshes the list,
   **Then** the paper appears on that refresh without delay.
3. **Given** a reviewer is not authenticated,
   **When** the reviewer attempts to open the assigned papers list,
   **Then** the system prompts for login and returns the reviewer to the list
   after successful authentication.

---

### User Story 2 - Open accepted paper details (Priority: P2)

As a reviewer, I want to open the accepted paper from my list and access the
paper details and manuscript so I can begin my review.

**Why this priority**: Review work cannot proceed without access to the paper
content.

**Independent Test**: From the list, the reviewer can open the paper and see
its details and manuscript access link.

**Acceptance Scenarios**:

1. **Given** a reviewer selects an accepted paper from the list,
   **When** the paper details view is opened,
   **Then** the system displays paper details and provides access to the
   manuscript.
2. **Given** a reviewer attempts to open a paper they have not accepted,
   **When** access is requested,
   **Then** the system denies access and indicates acceptance is required.
3. **Given** a reviewer’s session expires while viewing the list,
   **When** the reviewer opens an accepted paper,
   **Then** the system prompts for login and returns the reviewer to the paper
   details view after successful authentication.

---

### User Story 3 - Handle visibility and retrieval errors (Priority: P3)

As a reviewer, I want clear messages when assignments cannot be loaded or a
paper is unavailable so I understand what to do next.

**Why this priority**: Error handling prevents confusion and supports recovery
without blocking all progress.

**Independent Test**: The system shows a clear message and recovery option for
load failures or unavailable papers.

**Acceptance Scenarios**:

1. **Given** assignment retrieval fails,
   **When** the reviewer opens the assigned papers list,
   **Then** the system shows an error message and logs the failure.
2. **Given** a paper is unavailable (withdrawn/removed/file missing),
   **When** the reviewer opens the paper details,
   **Then** the system blocks access and shows an unavailable message.
3. **Given** the assignment acceptance was not recorded correctly,
   **When** the reviewer opens the list,
   **Then** the system indicates no accepted assignment exists and suggests
   retrying acceptance or contacting the editor.

---

### Traceability

- Use Case: UC-18
- Scenarios: S-18
- Acceptance Tests: AT-18 (AT-UC18-01 through AT-UC18-08)

### Edge Cases

- Reviewer session expired when opening the list.
- Assignment acceptance was not recorded correctly.
- Paper/manuscript becomes unavailable after acceptance.
- Assignment retrieval fails due to database error.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST show accepted assignments in the reviewer’s
  assigned papers list. An accepted assignment is one with status `accepted`.
- **FR-002**: The system MUST allow the reviewer to open an accepted paper and
  view paper details with manuscript access via a view/download link.
- **FR-003**: The system MUST deny access to papers that do not have an accepted
  assignment and indicate acceptance is required.
- **FR-004**: The system MUST prompt authentication if the reviewer is not
  logged in and return them to the originally requested list or paper after
  login.
- **FR-005**: The system MUST allow the reviewer to refresh the assigned papers
  list and show newly accepted assignments on the next refresh.
- **FR-006**: The system MUST show an error message and log failures when
  assignments cannot be retrieved.
- **FR-007**: The system MUST block access and show an unavailable message when
  a paper or manuscript is withdrawn, removed, or missing.
- **FR-008**: The system MUST restrict paper details visibility to accepted
  assignments only (no access before acceptance).

### Key Entities *(include if feature involves data)*

- **ReviewerAssignment**: Links a reviewer to a paper with status (accepted).
- **Paper**: The manuscript metadata and status (available/unavailable).
- **Reviewer**: The authenticated reviewer identity.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of accepted assignments appear in the assigned papers list
  within one refresh cycle.
- **SC-002**: 100% of attempts to open accepted papers show details and provide
  manuscript access.
- **SC-003**: 100% of access attempts without acceptance are blocked with a
  clear message.
- **SC-004**: 95% of assignment list loads complete in under 2 seconds.
- **SC-005**: 100% of assignment retrieval failures are logged and surface a
  user-facing error.

## Non-Functional Requirements

- **NFR-001**: Assignment list retrieval MUST complete within 2 seconds under
  typical conditions.
- **NFR-002**: Error messages and list actions MUST be keyboard accessible with
  visible focus states.

## Assumptions

- Visibility is based on accepted assignments only; no access before acceptance.
- Visibility is immediate on the next list load/refresh after acceptance.
- Reviewers can authenticate via existing CMS login.
