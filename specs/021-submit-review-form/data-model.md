# Data Model: Submit Completed Review Form

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/021-submit-review-form/spec.md

## Entities

### ReviewForm
- **Fields**:
  - `formId` (string, unique)
  - `paperId` (string, required)
  - `requiredFields` (array of field keys)
  - `status` (enum: active, closed)

### ReviewDraft
- **Fields**:
  - `draftId` (string, unique)
  - `paperId` (string, required)
  - `reviewerId` (string, required)
  - `content` (object)
  - `validationErrors` (object, optional)
  - `updatedAt` (timestamp)

### SubmittedReview
- **Fields**:
  - `submissionId` (string, unique)
  - `paperId` (string, required)
  - `reviewerId` (string, required)
  - `content` (object)
  - `submittedAt` (timestamp)
  - `status` (enum: submitted)

### ReviewerAssignment
- **Fields**:
  - `assignmentId` (string, unique)
  - `paperId` (string, required)
  - `reviewerId` (string, required)
  - `status` (enum: pending, accepted, rejected)

### NotificationLog
- **Fields**:
  - `notificationId` (string, unique)
  - `paperId` (string, required)
  - `reviewerId` (string, required)
  - `status` (enum: sent, failed)
  - `createdAt` (timestamp)

## Relationships

- Paper 1 : 1 ReviewForm
- Paper 1 : 0..* ReviewDraft
- Paper 1 : 0..* SubmittedReview
- Paper 1 : 0..* ReviewerAssignment
- ReviewerAssignment 1 : 0..1 SubmittedReview
- SubmittedReview 1 : 0..* NotificationLog

## Validation Rules

- Required fields defined by ReviewForm must be present before submission.
- Only reviewers with accepted assignments can submit.
- Submission is blocked if ReviewForm status is `closed` (view-only).
- Duplicate submissions are blocked once a SubmittedReview exists.
- Save failures preserve ReviewDraft and validation state.
- If notifications are enabled, log success/failure after submission.

## State Transitions

- ReviewForm: `active` -> `closed`
- ReviewerAssignment: `pending` -> `accepted` or `rejected`
- ReviewDraft: `draft` -> `submitted` (final; no resubmission)
