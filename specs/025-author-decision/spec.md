# Feature Specification: Receive Editor’s Decision

**Feature Branch**: `025-author-decision`
**Created**: 2026-02-03
**Status**: Draft
**Input**: User description: "UC-25"

## Clarifications

### Session 2026-02-03

- Q: Should decision release be immediate or staged? → A: Staged release at a configured time.
- Q: Which authors should be notified? → A: All co-authors.
- Q: Are decision notes required and visible? → A: Notes are optional and shown when present.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Author views decision in CMS (Priority: P1)

As an author, I can view the editor’s final decision for my paper in My Submissions so I know whether it was accepted or rejected.

**Why this priority**: In-app visibility is the primary, reliable delivery mechanism for decisions.

**Independent Test**: Can be tested by logging in as the submitting author and opening the decision view for a decided paper.

**Acceptance Scenarios**:

1. **Given** a final decision has been recorded for my paper, **When** I open My Submissions and select the paper, **Then** I see the decision outcome and any notes if provided. (Trace: UC-25 Main, S-25 Main, AT-UC25-01)
2. **Given** I am logged out, **When** I try to view my decision in-app, **Then** I am prompted to log in and returned to the decision view. (Trace: UC-25 6a, S-25 6a, AT-UC25-05)

---

### User Story 2 - Author receives notifications when enabled (Priority: P2)

As an author, I receive a decision notification via configured channels so I am alerted when a decision is released.

**Why this priority**: Notifications improve timeliness but should not replace in-app access.

**Independent Test**: Can be tested by enabling notifications and verifying delivery via email and/or in-app alerts.

**Acceptance Scenarios**:

1. **Given** notifications are enabled, **When** a decision is released, **Then** a notification is delivered to the author with the decision summary. (Trace: UC-25 Main, S-25 Main, AT-UC25-02)
2. **Given** notification delivery fails, **When** a decision is released, **Then** the decision remains visible in-app and the failure is logged. (Trace: UC-25 5a, S-25 5a, AT-UC25-03)
3. **Given** email delivery is configured but the author email is invalid, **When** a decision is released, **Then** the system falls back to in-app notification (if supported) and logs the issue. (Trace: UC-25 3a, S-25 3a, AT-UC25-04)
4. **Given** all notification channels are disabled, **When** a decision is released, **Then** no notification is sent and the decision remains available in-app. (Trace: UC-25 5b, S-25 5b, AT-UC25-09)

---

### User Story 3 - Access control and staged release (Priority: P3)

As a system, I must restrict decision visibility to authorized authors and optionally stage release times without exposing decisions early.

**Why this priority**: Protects confidentiality and supports scheduled decision releases.

**Independent Test**: Can be tested by attempting access as a non-author and by staging a release time.

**Acceptance Scenarios**:

1. **Given** a user is not associated with the paper, **When** they attempt to view the decision, **Then** access is denied and the attempt is logged. (Trace: UC-25 6b, S-25 6b, AT-UC25-06)
2. **Given** staged release is configured and the release time has not arrived, **When** the author views the paper, **Then** the decision shows as pending and the outcome is hidden. (Trace: UC-25 2a, S-25 2a, AT-UC25-07)
3. **Given** decision notes are not provided, **When** the author views the decision, **Then** the outcome is shown without notes. (Trace: UC-25 7a, S-25 7a, AT-UC25-08)

---

### Edge Cases

- What happens when notification delivery fails?
- What happens when author email is missing or invalid?
- What happens when a non-author attempts access?
- What happens when decisions are staged for later release?
- What happens when decision notes are absent?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST make final decisions visible in-app to associated authors once released.
- **FR-002**: System MUST display decision outcome and any available decision notes.
- **FR-003**: System MUST enforce author authentication before showing decisions in-app.
- **FR-004**: System MUST deny decision access to non-authors and log the attempt.
- **FR-005**: System MUST support notifications via configured channels (email and/or in-app) when enabled.
- **FR-006**: If notifications fail, the system MUST keep the decision visible in-app and log the failure.
- **FR-007**: If author email is invalid, the system MUST fall back to in-app notification when supported and log the issue.
- **FR-008**: System MUST use staged release based on a conference-configured UTC release timestamp.
- **FR-009**: System MUST show a pending decision state before staged release publication.
- **FR-010**: Decision visibility MUST be restricted to associated authors and co-authors.
- **FR-011**: When notifications are enabled, the system MUST notify all co-authors listed on the paper at release time.
- **FR-012**: The system MUST respect per-author notification settings and send no notification when all channels are disabled.
- **FR-013**: If all channels are disabled, the decision MUST still be visible in-app after release.
- **FR-014**: In-app fallback notifications MUST only be used when the in-app channel is enabled.

### Non-Functional Requirements

- **NFR-001**: Authors see the decision view update from “Pending” to the released outcome within 1 minute of the release timestamp.
- **NFR-002**: Decision views and notification preference controls MUST meet WCAG 2.1 AA accessibility requirements.
- **NFR-003**: Access-denied and notification-failure audit logs MUST be retained for at least 90 days.

### Key Entities *(include if feature involves data)*

- **Paper**: Submission with decision state and authorship links.
- **Decision**: Final Accept/Reject outcome with optional notes.
- **Author**: User associated with a paper.
- **Notification**: Delivery record for decision notifications.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of released decisions are visible to the submitting author in-app within 1 minute of release.
- **SC-002**: 100% of unauthorized access attempts are blocked and logged.
- **SC-003**: 95% of decision notifications (when enabled) are delivered within 2 minutes of release.
- **SC-004**: 100% of staged decisions show “Pending” before release.

## Assumptions

- Decisions are visible in-app by default; notifications are optional.
- Email notifications may be used when configured; invalid emails fall back to in-app only if the in-app channel is enabled.
- Staged release is used and configured at the conference level with a UTC release timestamp.
- Decision notes are optional.
- All co-authors listed on the paper at release time receive notifications when notifications are enabled.
