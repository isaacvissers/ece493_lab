# Data Model: Generate Conference Schedule

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/026-generate-schedule/spec.md

## Entities

### Conference
- **Fields**:
  - `conferenceId` (string, unique)
  - `dateRange` (object: start, end)
  - `rooms` (array of room ids)
  - `slotDurationMinutes` (number)
  - `constraints` (object, optional)

### Paper
- **Fields**:
  - `paperId` (string, unique)
  - `status` (enum: accepted, rejected, submitted)
  - `title` (string)
  - `requiredMetadataComplete` (boolean)

### Room
- **Fields**:
  - `roomId` (string, unique)
  - `name` (string)
  - `capacity` (number, optional)

### TimeSlot
- **Fields**:
  - `slotId` (string, unique)
  - `startTime` (timestamp)
  - `endTime` (timestamp)
  - `roomId` (string, required)

### Schedule
- **Fields**:
  - `scheduleId` (string, unique)
  - `conferenceId` (string, required)
  - `status` (enum: draft, saved, published)
  - `createdAt` (timestamp)
  - `updatedAt` (timestamp)

### ScheduleItem
- **Fields**:
  - `itemId` (string, unique)
  - `scheduleId` (string, required)
  - `paperId` (string, required)
  - `roomId` (string, optional)
  - `slotId` (string, optional)
  - `status` (enum: scheduled, unscheduled)
  - `reason` (string, optional)

### AuditLog
- **Fields**:
  - `logId` (string, unique)
  - `eventType` (enum: schedule_generated, schedule_saved, schedule_publish_failed, schedule_save_failed, access_denied)
  - `relatedId` (string, required)
  - `createdAt` (timestamp)
  - `details` (object)

## Relationships

- Conference 1 : 0..* Schedule
- Schedule 1 : 0..* ScheduleItem
- ScheduleItem 1 : 1 Paper
- Conference 1 : 0..* Room
- Room 1 : 0..* TimeSlot

## Validation Rules

- Only accepted papers are eligible for scheduling.
- Conflicting room/time assignments are blocked until admin adjustment.
- Papers missing required metadata are excluded and flagged as unscheduled.
- If capacity is insufficient, unscheduled papers are flagged with reason.

## State Transitions

- Schedule: draft -> saved -> published
- ScheduleItem: unscheduled -> scheduled
