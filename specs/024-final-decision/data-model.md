# Data Model: Make Final Accept/Reject Decision

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/024-final-decision/spec.md

## Entities

### Paper
- **Fields**:
  - `paperId` (string, unique)
  - `status` (enum: submitted, accepted, rejected)
  - `editorId` (string, required)

### Review
- **Fields**:
  - `reviewId` (string, unique)
  - `paperId` (string, required)
  - `status` (enum: draft, submitted)

### Decision
- **Fields**:
  - `decisionId` (string, unique)
  - `paperId` (string, required)
  - `editorId` (string, required)
  - `value` (enum: accept, reject)
  - `comments` (string, optional)
  - `decidedAt` (timestamp)

### Notification
- **Fields**:
  - `notificationId` (string, unique)
  - `paperId` (string, required)
  - `decisionId` (string, required)
  - `status` (enum: sent, failed)
  - `sentAt` (timestamp, optional)
  - `reason` (string, optional)

### AuditLog
- **Fields**:
  - `logId` (string, unique)
  - `eventType` (enum: decision_saved, decision_failed, auth_failed, notification_failed)
  - `relatedId` (string, required)
  - `createdAt` (timestamp)
  - `details` (object)

## Relationships

- Paper 1 : 0..* Review
- Paper 1 : 0..1 Decision (final decision)
- Decision 1 : 0..* Notification
- Decision 1 : 0..* AuditLog

## Validation Rules

- Exactly three submitted reviews are required to save a decision.
- Decision value must be accept or reject.
- Only authorized editor for the paper may save a decision.
- Decisions are final unless an administrator resets them.

## State Transitions

- Paper: `submitted` -> `accepted` or `rejected`
- Decision: created once per paper unless reset by admin
- Notification: `sent` or `failed` (no rollback of Decision)
