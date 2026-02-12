# Feature Specification: Edit and Update Conference Schedule

**Feature Branch**: `028-edit-schedule`  
**Created**: 2026-02-03  
**Status**: Draft  
**Input**: User description: "UC-28"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Edit schedule entries (Priority: P1)

As an editor, I can edit room/time assignments for schedule entries so I can resolve conflicts and correct the schedule.

**Why this priority**: Editing schedule entries is the core capability in UC-28 and enables all downstream fixes.

**Independent Test**: Can be tested by editing a single schedule entry and verifying the change appears in schedule views.

**Acceptance Scenarios**:

1. **Given** a schedule exists and I am authorized, **When** I update a schedule entry to a valid room/time, **Then** the system saves the change and confirms the update. (Trace: UC-28 Main, S-28 Main, AT-UC28-01)
2. **Given** a schedule entry update is saved, **When** I view schedule views, **Then** the updated time/room assignment is shown; the HTML schedule reflects changes after the draft is published. (Trace: UC-28 Main, S-28 Main, AT-UC28-02)
3. **Given** a proposed update creates a room-time conflict, **When** I attempt to save, **Then** the system blocks the save and identifies the conflicting entry. (Trace: UC-28 6a, S-28 6a, AT-UC28-03)
4. **Given** a proposed update is outside the conference time window, **When** I attempt to save, **Then** the system blocks the save and shows the allowed window. (Trace: UC-28 6b, S-28 6b, AT-UC28-04)

---

### User Story 2 - Unscheduling, missing schedule, and authorization (Priority: P2)

As an editor, I receive clear guidance when a schedule is missing, when I try to unschedule an entry, or when I lack permission.

**Why this priority**: Editors need clear outcomes for policy and access constraints to avoid silent or confusing failures.

**Independent Test**: Can be tested by editing with no schedule, attempting to remove an entry, and using an unauthorized account.

**Acceptance Scenarios**:

1. **Given** a schedule exists, **When** I remove an entry, **Then** the system follows the defined unscheduling policy and communicates the outcome. (Trace: UC-28 5a, S-28 5a, AT-UC28-05)
2. **Given** no schedule exists, **When** I open scheduling, **Then** the system shows “No schedule available” and disables editing. (Trace: UC-28 4a, S-28 4a, AT-UC28-06)
3. **Given** I am not authorized, **When** I attempt to edit, **Then** access is denied and the attempt is logged. (Trace: UC-28 3a, S-28 3a, AT-UC28-07)

---

### User Story 3 - Failure handling and concurrency (Priority: P3)

As an editor, I am protected from data loss when saves fail, concurrent edits occur, or optional notifications fail.

**Why this priority**: Safe failure handling prevents accidental overwrites and preserves schedule integrity.

**Independent Test**: Can be tested by simulating DB failures, concurrent edits, and notification failures.

**Acceptance Scenarios**:

1. **Given** a database write fails, **When** I save an update, **Then** the system shows an error, logs the failure, and does not change the schedule. (Trace: UC-28 7a, S-28 7a, AT-UC28-08)
2. **Given** another user saved a change first, **When** I try to save my edit, **Then** the system detects a version mismatch and requires refresh before saving. (Trace: UC-28 6c, S-28 6c, AT-UC28-09)
3. **Given** notifications/publish fail after save, **When** the system attempts them, **Then** the schedule changes remain saved and the failure is logged. (Trace: UC-28 8a, S-28 8a, AT-UC28-10)

---

### Edge Cases

- What happens when a schedule does not exist yet?
- What happens when an editor attempts to create a room-time conflict?
- What happens when an editor selects a time outside the allowed window?
- What happens when a save fails due to a database error?
- What happens when concurrent edits are detected?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow authorized editors (editor role assigned to the conference, or administrators) to edit room and time assignments for schedule entries.
- **FR-002**: System MUST validate edits to prevent room-time double booking.
- **FR-003**: System MUST validate edits to ensure assignments are within the conference time window (start and end boundaries, inclusive).
- **FR-004**: System MUST ensure a paper is scheduled at most once at any time.
- **FR-005**: System MUST block saving and show a clear conflict message when validation fails.
- **FR-006**: System MUST save valid updates and confirm success to the editor.
- **FR-007**: System MUST reflect saved updates in schedule views; the HTML schedule view reflects changes after the draft is published.
- **FR-008**: If no schedule exists, the system MUST show “No schedule available” and disable editing.
- **FR-009**: Unauthorized edit attempts MUST be denied and logged.
- **FR-010**: The system MUST require every paper to remain scheduled; unscheduling without a new assignment is not allowed.
- **FR-011**: The system MUST handle concurrent edits by detecting version mismatch and requiring the editor to refresh before saving.
- **FR-012**: Schedule edits MUST apply to the draft schedule only; publication is a separate step.
- **FR-013**: The system MUST notify authors/attendees of affected papers after schedule updates are saved; notification is triggered once per saved update.
- **FR-014**: If persistence fails, the system MUST show an error, log the failure, and leave the schedule unchanged.

### Non-Functional Requirements

- **NFR-001**: Schedule edit actions MUST respond within 200 ms on a typical development laptop.
- **NFR-002**: Conflict detection MUST complete within 1 second for up to 300 schedule items.
- **NFR-003**: Edit screens MUST be keyboard operable with visible focus states for all interactive controls.
- **NFR-004**: Edit failures and unauthorized attempts MUST be logged and retained for at least 90 days.

### Key Entities *(include if feature involves data)*

- **Schedule**: The draft or published schedule being edited.
- **ScheduleEntry**: A paper assignment to a room and time slot.
- **Conference**: Context and constraints (time window) for the schedule.
- **User**: Editor or administrator performing edits.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of valid schedule edits are saved and visible in schedule views on the next refresh.
- **SC-002**: 100% of conflicting edits are blocked with a clear conflict message.
- **SC-003**: 100% of unauthorized edit attempts are denied and logged.
- **SC-004**: 100% of concurrent edit attempts require refresh before saving.

## Assumptions

- Editors are authenticated before accessing schedule editing.
- The schedule time window is configured per conference.
- Conflict detection uses current schedule state at time of save.
