# Data Model: Edit and Update Conference Schedule

**Date**: 2026-02-03  
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/028-edit-schedule/spec.md

## Entities

### Schedule
- **Fields**:
  - `scheduleId` (string, unique)
  - `conferenceId` (string, required)
  - `status` (enum: draft, published)
  - `version` (integer, required)
  - `updatedAt` (timestamp)

### ScheduleEntry
- **Fields**:
  - `entryId` (string, unique)
  - `scheduleId` (string, required)
  - `paperId` (string, required)
  - `roomId` (string, required)
  - `startTime` (timestamp, required)
  - `endTime` (timestamp, required)

### Conference
- **Fields**:
  - `conferenceId` (string, unique)
  - `name` (string)
  - `timeWindowStart` (timestamp)
  - `timeWindowEnd` (timestamp)

### User
- **Fields**:
  - `userId` (string, unique)
  - `role` (enum: editor, admin)

### NotificationLog
- **Fields**:
  - `notificationId` (string, unique)
  - `scheduleId` (string, required)
  - `status` (enum: pending, sent, failed)
  - `createdAt` (timestamp)

### AuditLog
- **Fields**:
  - `logId` (string, unique)
  - `eventType` (enum: schedule_edit_denied, schedule_edit_failed, schedule_conflict, schedule_concurrency)
  - `relatedId` (string, required)
  - `createdAt` (timestamp)
  - `details` (object)

## Relationships

- Conference 1 : 0..* Schedule (draft or published)
- Schedule 1 : 0..* ScheduleEntry
- Schedule 1 : 0..* NotificationLog

## Validation Rules

- No room-time double booking within a schedule.
- ScheduleEntry times must fall within Conference time window.
- Each paper may appear at most once in the schedule.
- Unscheduling without replacement is not allowed.
- Version mismatch blocks save and requires refresh.

## State Transitions

- Schedule: draft -> published
- NotificationLog: pending -> sent | failed
