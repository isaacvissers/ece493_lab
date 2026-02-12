# Feature Specification: Send Completed Reviews to the Editor

**Feature Branch**: `023-send-editor-reviews`
**Created**: 2026-02-03
**Status**: Draft
**Input**: User description: "UC-23 make sure the branch names starts with 023"

## Clarifications

### Session 2026-02-03

- Q: If notifications are enabled, which channel(s) should be used? → A: Both email and in-app notifications (always when enabled).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Editor can see newly submitted reviews in-app (Priority: P1)

As an editor, I can see submitted reviews for my papers in the CMS review list so I can make decisions without waiting for manual delivery.

**Why this priority**: In-app visibility is the core value of “send to editor” and enables editorial decisions.

**Independent Test**: Can be tested by submitting a review for a paper and verifying the editor’s review list updates.

**Acceptance Scenarios**:

1. **Given** a reviewer submits a valid review for a paper with an assigned editor, **When** the submission succeeds, **Then** the review is visible to that editor in-app. (Trace: UC-23 Main, S-23 Main, AT-UC23-01)
2. **Given** a review submission fails validation or persistence, **When** the submission is rejected, **Then** the editor does not see a new submitted review. (Trace: UC-23 2a, S-23 2a, AT-UC23-04)

---

### User Story 2 - Editor receives notifications when enabled (Priority: P2)

As an editor, I receive a notification when a review is submitted (if notifications are enabled) so I am promptly alerted to new reviews.

**Why this priority**: Notifications improve responsiveness but are secondary to in-app access.

**Independent Test**: Can be tested by enabling notifications and confirming a notification is generated after submission.

**Acceptance Scenarios**:

1. **Given** notifications are enabled, **When** a review is submitted successfully, **Then** notifications are generated for the editor via both email and in-app channels. (Trace: UC-23 Main, S-23 Main, AT-UC23-02)
2. **Given** the notification service fails, **When** a review is submitted, **Then** the review remains visible in-app and the notification failure is logged. (Trace: UC-23 5a, S-23 5a, AT-UC23-03)

---

### User Story 3 - Delivery exceptions are handled safely (Priority: P3)

As an administrator/editor, I need delivery exceptions handled with clear logging and no data loss so editorial work is not blocked.

**Why this priority**: Exceptions are less frequent but prevent hidden failures and duplicate delivery.

**Independent Test**: Can be tested by simulating each exception and verifying safe outcomes and logs.

**Acceptance Scenarios**:

1. **Given** the editor cannot be determined for a paper, **When** a review is submitted, **Then** the review is stored and the issue is flagged and logged. (Trace: UC-23 4a, S-23 4a, AT-UC23-05)
2. **Given** the editor lacks permission to view the review, **When** the editor attempts access, **Then** access is denied and the authorization issue is logged. (Trace: UC-23 7a, S-23 7a, AT-UC23-06)
3. **Given** a duplicate delivery attempt occurs, **When** the system processes the same review again, **Then** duplicate notifications are suppressed and only one review record appears. (Trace: UC-23 3a, S-23 3a, AT-UC23-07)
4. **Given** multiple reviews arrive in a short window, **When** delivery runs, **Then** all reviews appear in-app and notifications are sent per configuration. (Trace: UC-23 6a, S-23 6a, AT-UC23-08)
5. **Given** audit logging fails after delivery, **When** a review is delivered, **Then** the editor still has access and the logging failure is recorded. (Trace: UC-23 8a, S-23 8a, AT-UC23-09)

---

### Edge Cases

- What happens when the editor mapping is missing at submission time?
- How does the system handle notification service outages without blocking in-app access?
- What happens when delivery is retried for the same review?
- How does the system behave when multiple reviews are submitted in a short time window?
- What happens when audit/log writes fail after delivery?
- Where do editors/admins see flags when delivery cannot determine an editor?
- What happens when notification retries are exhausted?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST make each successfully submitted review visible in-app to the assigned editor for the paper.
- **FR-002**: System MUST NOT attempt delivery or notification when review submission fails.
- **FR-003**: System MUST associate each submitted review with the correct paper and editor (or editor role) based on assignment.
- **FR-004**: System MUST send notifications via both email and in-app channels when notifications are enabled.
- **FR-005**: System MUST log delivery and notification outcomes, including failures.
- **FR-006**: System MUST detect and suppress duplicate delivery/notification attempts for the same review.
- **FR-007**: If the editor cannot be determined, the system MUST store the review and flag the paper/review for administrative attention.
- **FR-008**: If the editor lacks permission to view a delivered review, the system MUST deny access and log the authorization error.
- **FR-009**: When multiple reviews are submitted close together, the system MUST ensure all become visible in-app; notifications may be sent per review or grouped per configuration.
- **FR-010**: Audit/log failures MUST NOT remove editor access to submitted reviews.
- **FR-011**: The system MUST surface delivery/mapping flags in an administrator-facing queue or dashboard within the CMS.
- **FR-012**: If notifications fail, the system MUST retry up to 3 times at 5-minute intervals and allow an administrator to manually resend.
- **FR-013**: If grouped notifications are enabled, the batching window MUST be 10 minutes from the first submitted review for a paper.

### Key Entities *(include if feature involves data)*

- **Review**: Submitted evaluation content, status, timestamps, linked to a paper and reviewer.
- **Paper**: The submission under review, linked to an assigned editor.
- **Editor**: User responsible for viewing reviews and making decisions for a paper.
- **Notification**: Optional alert record tied to a review delivery event and channel.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of submitted reviews are visible to the assigned editor in-app within 1 minute of successful submission during the review period.
- **SC-002**: 100% of failed review submissions result in no editor delivery or notification.
- **SC-003**: 95% of notifications (when enabled) are generated for both email and in-app channels within 2 minutes of submission, without exposing restricted content.
- **SC-004**: 100% of duplicate delivery attempts are suppressed to a single in-app review record and at most one notification per review.

## Non-Functional Requirements

- **NFR-001**: Delivery and notification processing MUST be idempotent to prevent duplicate editor notifications.
- **NFR-002**: Delivery/notification failures MUST be observable via logged events with status and reason.
- **NFR-003**: Editor review lists and notification views MUST be keyboard accessible and provide visible focus states.

## Assumptions

- “Send to editor” means in-app availability is required; notifications are optional and, when enabled, use both email and in-app channels.
- Default behavior is to notify per submitted review when notifications are enabled; no waiting for all three reviews.
- Grouped notifications are permitted only if explicitly configured and follow the 10-minute batching window.
