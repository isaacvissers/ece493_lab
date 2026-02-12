# Data Model: Receive Editor’s Decision

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/025-author-decision/spec.md

## Entities

### Paper
- **Fields**:
  - `paperId` (string, unique)
  - `status` (enum: submitted, accepted, rejected)
  - `authorIds` (array of user ids)
  - `decisionReleaseAt` (timestamp, optional)

### Decision
- **Fields**:
  - `decisionId` (string, unique)
  - `paperId` (string, required)
  - `value` (enum: accept, reject)
  - `notes` (string, optional)
  - `releasedAt` (timestamp, optional)

### Author
- **Fields**:
  - `authorId` (string, unique)
  - `email` (string, optional)

### Notification
- **Fields**:
  - `notificationId` (string, unique)
  - `paperId` (string, required)
  - `decisionId` (string, required)
  - `recipientId` (string, required)
  - `channel` (enum: email, in_app)
  - `status` (enum: sent, failed)
  - `sentAt` (timestamp, optional)
  - `reason` (string, optional)

### AuditLog
- **Fields**:
  - `logId` (string, unique)
  - `eventType` (enum: decision_released, notification_failed, access_denied)
  - `relatedId` (string, required)
  - `createdAt` (timestamp)
  - `details` (object)

## Relationships

- Paper 1 : 1..* Author
- Paper 1 : 0..1 Decision
- Decision 1 : 0..* Notification (one per author per channel when enabled)
- Decision 1 : 0..* AuditLog

## Validation Rules

- Decisions are visible in-app only after release time (staged release).
- Only authors associated with the paper may view decisions.
- If email is invalid, fall back to in-app notification when supported.
- Notifications target all co-authors when enabled.

## State Transitions

- Decision: unreleased -> released
- Notification: `sent` or `failed` (no rollback of Decision)
