# Feature Specification: Final Schedule Delivery to Authors

**Feature Branch**: `029-final-schedule-delivery`  
**Created**: 2026-02-03  
**Status**: Draft  
**Input**: User description: "UC-29 make sure the branch names starts with 029 and follows the format of all other branch names"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Receive final schedule (Priority: P1)

As an author of an accepted paper, I can access my final schedule details so I know when and where I will present.

**Why this priority**: This is the primary goal of UC-29 and the most critical user value once the schedule is published.

**Independent Test**: Can be tested by publishing a schedule and verifying that an accepted author can see time/room details for their paper.

**Acceptance Scenarios**:

1. **Given** the schedule is published and I am an associated author of an accepted paper, **When** I view my schedule in CMS, **Then** I see my paper’s time and room. (Trace: UC-29 Main, S-29 Main, AT-UC29-01)
2. **Given** the schedule is published, **When** the system releases schedule notifications, **Then** I receive a notification with my paper’s time and room via email and in-app. (Trace: UC-29 Main, S-29 Main, AT-UC29-02)

---

### User Story 2 - Schedule not yet available (Priority: P2)

As an author, I get clear status when the schedule is not yet published so I don’t assume incorrect dates.

**Why this priority**: Prevents confusion when schedules are still pending.

**Independent Test**: Can be tested by attempting to view the schedule before publication and verifying the pending state.

**Acceptance Scenarios**:

1. **Given** the schedule is not published, **When** I open my schedule view, **Then** I see “Schedule not available yet” and no schedule details. (Trace: UC-29 1a, S-29 1a, AT-UC29-03)
2. **Given** schedule publication fails, **When** I open my schedule view, **Then** I see “Schedule not available yet” and no schedule details or notifications are released. (Trace: UC-29 8a, S-29 8a, AT-UC29-08)

---

### User Story 3 - Delivery failures and access issues (Priority: P3)

As an author, I can still access my schedule in CMS even if notification delivery fails, and unauthorized access is blocked.

**Why this priority**: Ensures schedule delivery is resilient and secure.

**Independent Test**: Can be tested by simulating notification failure and unauthorized access attempts.

**Acceptance Scenarios**:

1. **Given** notification delivery fails, **When** the schedule is published, **Then** my schedule is still accessible in CMS and the failure is logged. (Trace: UC-29 5a, S-29 5a, AT-UC29-04)
2. **Given** I am not authenticated, **When** I attempt to view my schedule, **Then** I am prompted to log in and returned to my schedule after login. (Trace: UC-29 6a, S-29 6a, AT-UC29-05)
3. **Given** I attempt to view a schedule I’m not associated with, **When** I access the schedule view, **Then** access is denied and the attempt is logged. (Trace: UC-29 6b, S-29 6b, AT-UC29-06)
4. **Given** my paper is accepted but not scheduled, **When** I view my schedule, **Then** I see “Unscheduled” and guidance to contact the organizer. (Trace: UC-29 7a, S-29 7a, AT-UC29-07)

---

### Edge Cases

- When a schedule is not yet published, the system shows “Schedule not available yet” and no details.
- When notification delivery fails, the system logs the failure and keeps schedule access available.
- When an accepted paper has no schedule assignment, the system shows “Unscheduled” with guidance.
- When an unauthorized author attempts access, the system denies access and logs the attempt.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display final schedule details (time and room) for accepted papers when the schedule is published.
- **FR-002**: The system MUST restrict schedule access to authenticated authors whose authorId appears on the accepted paper (all co-authors).
- **FR-003**: If the schedule status is not published, the system MUST show “Schedule not available yet” and suppress schedule details.
- **FR-004**: The system MUST send schedule notifications after publication via both email and in-app channels, triggered once per publication.
- **FR-005**: The system MUST send notifications to all co-authors listed on the accepted paper.
- **FR-006**: If notification delivery fails, the system MUST log the failure and keep schedule access available in CMS.
- **FR-007**: If an accepted paper has no schedule assignment, the system MUST show “Unscheduled” and guidance to contact organizers.
- **FR-008**: The system MUST deny access and log attempts when an author is not associated with the paper.
- **FR-009**: The system MUST return authors to their schedule view after login.
- **FR-010**: Schedule delivery MUST include only time and room details (no session chair or presentation format).
- **FR-011**: If schedule publication fails, the system MUST not release schedule details or notifications to authors.

### Non-Functional Requirements

- **NFR-001**: Schedule view interactions MUST respond within 200 ms on a typical development laptop.
- **NFR-002**: Schedule detail retrieval MUST complete within 1 second for up to 300 accepted papers.
- **NFR-003**: Schedule views MUST be keyboard operable with visible focus states for all interactive controls.
- **NFR-004**: Notification failures and unauthorized access attempts MUST be logged and retained for at least 90 days.

### Key Entities *(include if feature involves data)*

- **Schedule**: Published schedule containing time and room assignments.
- **ScheduleEntry**: A paper’s assigned room and time.
- **Paper**: Accepted paper associated with the author.
- **Author**: User receiving schedule access.
- **Notification**: Delivery record for schedule updates.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of accepted authors can view their final schedule details after publication on the next refresh.
- **SC-002**: 100% of unauthorized access attempts are denied and logged.
- **SC-003**: 100% of notification failures are logged without blocking in-app access.
- **SC-004**: 100% of unscheduled accepted papers display “Unscheduled” with guidance.

## Assumptions

- Authors have CMS accounts and are linked to accepted papers (paper author list).
- Schedule publication is a distinct admin/editor action and is required for delivery.
- In-app schedule view is available to authors; delivery scope is limited to time and room only.
