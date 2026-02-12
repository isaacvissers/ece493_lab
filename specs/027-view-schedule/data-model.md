# Data Model: View Conference Schedule (HTML)

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/027-view-schedule/spec.md

## Entities

### Schedule
- **Fields**:
  - `scheduleId` (string, unique)
  - `conferenceId` (string, required)
  - `status` (enum: draft, published)
  - `updatedAt` (timestamp)

### ScheduleItem
- **Fields**:
  - `itemId` (string, unique)
  - `scheduleId` (string, required)
  - `paperTitle` (string)
  - `roomName` (string, optional)
  - `startTime` (timestamp, optional)
  - `endTime` (timestamp, optional)
  - `status` (enum: scheduled, unscheduled)

### Conference
- **Fields**:
  - `conferenceId` (string, unique)
  - `name` (string)

### User
- **Fields**:
  - `userId` (string, unique)
  - `role` (enum: admin, editor)

### AuditLog
- **Fields**:
  - `logId` (string, unique)
  - `eventType` (enum: schedule_view_denied, schedule_render_failed, schedule_timeout)
  - `relatedId` (string, required)
  - `createdAt` (timestamp)
  - `details` (object)

## Relationships

- Conference 1 : 0..1 Schedule (published)
- Schedule 1 : 0..* ScheduleItem

## Validation Rules

- Only published schedules are rendered in HTML view.
- Unscheduled items appear in a separate “Unscheduled” section.
- Unauthorized access attempts are logged.

## State Transitions

- Schedule: draft -> published
- ScheduleItem: unscheduled -> scheduled
