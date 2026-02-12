# Data Model: Ensure Exactly Three Referees per Paper

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/017-three-referees-per-paper/spec.md

## Entities

### Paper
- **Fields**:
  - `paperId` (string, unique)
  - `status` (enum: submitted, eligible, in_review, withdrawn, completed)

### RefereeAssignment
- **Fields**:
  - `assignmentId` (string, unique)
  - `paperId` (string, required)
  - `refereeId` (string, required)
  - `status` (enum: pending, accepted, declined, withdrawn)
  - `createdAt` (timestamp)
  - `updatedAt` (timestamp)

### RefereeInvitation (optional)
- **Fields**:
  - `invitationId` (string, unique)
  - `paperId` (string, required)
  - `refereeId` (string, required)
  - `status` (enum: pending, accepted, rejected, expired)
  - `sentAt` (timestamp)
  - `expiresAt` (timestamp)

### ReadinessAudit
- **Fields**:
  - `auditId` (string, unique)
  - `paperId` (string, required)
  - `timestamp` (timestamp)
  - `result` (enum: ready, blocked, error)
  - `count` (integer, optional)
  - `reason` (string)

## Relationships

- Paper 1 : 0..* RefereeAssignment
- Paper 1 : 0..* RefereeInvitation
- Paper 1 : 0..* ReadinessAudit

## Validation Rules

- Only non-declined assignments count toward the required three.
- Exactly three non-declined assignments are required for readiness.
- Attempts to add a fourth non-declined assignment must be blocked.
- If invitations are enabled, missing invitations must be flagged when three
  non-declined assignments exist.

## State Transitions

- RefereeAssignment: `pending` -> `accepted` or `declined` or `withdrawn`
- ReadinessAudit: `ready` / `blocked` / `error` entries recorded per check
