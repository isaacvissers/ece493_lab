# Data Model: Alert Editor on Reviewer Over-Assignment

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/019-alert-overassignment/spec.md

## Entities

### Paper
- **Fields**:
  - `paperId` (string, unique)
  - `status` (enum: submitted, eligible, in_review, withdrawn, completed)

### ReviewerAssignment
- **Fields**:
  - `assignmentId` (string, unique)
  - `paperId` (string, required)
  - `reviewerId` (string, required)
  - `status` (enum: pending, accepted, declined, withdrawn)
  - `createdAt` (timestamp)

### OverAssignmentAlert
- **Fields**:
  - `alertId` (string, unique)
  - `paperId` (string, required)
  - `count` (integer)
  - `createdAt` (timestamp)
  - `deliveryStatus` (enum: shown, fallback, failed)

## Relationships

- Paper 1 : 0..* ReviewerAssignment
- Paper 1 : 0..* OverAssignmentAlert

## Validation Rules

- Reviewer count > 3 triggers an over-assignment alert.
- Assignment additions that would exceed three are blocked.
- Batch assignments partially apply up to three and identify blocked additions.

## State Transitions

- ReviewerAssignment: `pending` -> `accepted` or `declined` or `withdrawn`
- OverAssignmentAlert: `shown` / `fallback` / `failed`
