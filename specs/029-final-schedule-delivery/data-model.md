# Data Model: Final Schedule Delivery to Authors

**Date**: 2026-02-03  
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/029-final-schedule-delivery/spec.md

## Entities

### Schedule
- **Fields**:
  - `scheduleId` (string, unique)
  - `conferenceId` (string, required)
  - `status` (enum: draft, published)
  - `publishedAt` (timestamp, optional)

### ScheduleEntry
- **Fields**:
  - `entryId` (string, unique)
  - `scheduleId` (string, required)
  - `paperId` (string, required)
  - `roomId` (string, required)
  - `startTime` (timestamp, required)
  - `endTime` (timestamp, required)

### Paper
- **Fields**:
  - `paperId` (string, unique)
  - `status` (enum: accepted, rejected)
  - `authorIds` (array, required)

### Author
- **Fields**:
  - `authorId` (string, unique)
  - `email` (string, required)

### Notification
- **Fields**:
  - `notificationId` (string, unique)
  - `paperId` (string, required)
  - `channel` (enum: email, in_app)
  - `status` (enum: pending, sent, failed)
  - `createdAt` (timestamp)

### AuditLog
- **Fields**:
  - `logId` (string, unique)
  - `eventType` (enum: schedule_notification_failed, schedule_access_denied)
  - `relatedId` (string, required)
  - `createdAt` (timestamp)
  - `details` (object)

## Relationships

- Schedule 1 : 0..* ScheduleEntry
- Paper 1 : 0..* ScheduleEntry
- Paper 1 : 0..* Notification
- Paper 1 : 1..* Author

## Validation Rules

- Schedule details are visible only when Schedule.status = published.
- Authors can access schedule details only if associated with the Paper.
- Unscheduled accepted papers surface an “Unscheduled” state.
- Notification failures do not block in-app schedule access.

## State Transitions

- Schedule: draft -> published
- Notification: pending -> sent | failed
