# Data Model: Access Review Form for Assigned Papers

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/020-access-review-form/spec.md

## Entities

### ReviewForm
- **Fields**:
  - `formId` (string, unique)
  - `paperId` (string, required)
  - `status` (enum: active, closed)

### ReviewDraft
- **Fields**:
  - `draftId` (string, unique)
  - `paperId` (string, required)
  - `reviewerId` (string, required)
  - `content` (object)
  - `updatedAt` (timestamp)

### ReviewerAssignment
- **Fields**:
  - `assignmentId` (string, unique)
  - `paperId` (string, required)
  - `reviewerId` (string, required)
  - `status` (enum: pending, accepted, rejected)

### Paper
- **Fields**:
  - `paperId` (string, unique)
  - `status` (enum: available, withdrawn, removed)

## Relationships

- Paper 1 : 1 ReviewForm
- Paper 1 : 0..* ReviewDraft (per reviewer)
- Paper 1 : 0..* ReviewerAssignment
- ReviewerAssignment 1 : 0..1 ReviewDraft

## Validation Rules

- Only reviewers with accepted assignments can access the review form.
- Review form is view-only when review period is closed.
- Missing form configuration blocks access and logs an error.

## State Transitions

- ReviewForm: `active` -> `closed`
- ReviewerAssignment: `pending` -> `accepted` or `rejected`
