# Data Model: View Accepted Assigned Paper in Reviewer Account

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/018-view-assigned-paper/spec.md

## Entities

### Reviewer
- **Fields**:
  - `reviewerId` (string, unique)
  - `email` (string, unique)

### ReviewerAssignment
- **Fields**:
  - `assignmentId` (string, unique)
  - `paperId` (string, required)
  - `reviewerId` (string, required)
  - `status` (enum: pending, accepted, declined)
  - `acceptedAt` (timestamp, optional)

### Paper
- **Fields**:
  - `paperId` (string, unique)
  - `title` (string)
  - `status` (enum: available, withdrawn, removed)
  - `manuscriptAvailable` (boolean)

### Manuscript
- **Fields**:
  - `manuscriptId` (string, unique)
  - `paperId` (string, required)
  - `fileStatus` (enum: available, missing)

## Relationships

- Reviewer 1 : 0..* ReviewerAssignment
- Paper 1 : 0..* ReviewerAssignment
- Paper 1 : 0..1 Manuscript (when available)

## Validation Rules

- Only assignments with status `accepted` appear in reviewer lists.
- Access to paper details requires an accepted assignment.
- Unavailable or missing manuscripts block access and surface an error.

## State Transitions

- ReviewerAssignment: `pending` -> `accepted` or `declined`
- Paper: `available` -> `withdrawn` or `removed`
