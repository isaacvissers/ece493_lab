# Data Model: Notify Editor of Assignment Rule Violations

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/015-notify-assignment-violations/spec.md

## Entities

### Reviewer
- **Fields**:
  - `reviewerId` (string, unique)
  - `email` (string, unique)
  - `activeAssignmentCount` (number, derived or stored)
- **Constraints**:
  - Email uniqueness required
  - `activeAssignmentCount` MUST be <= 5

### Paper
- **Fields**:
  - `paperId` (string, unique)
  - `status` (enum: submitted, eligible, in_review, withdrawn, completed)
- **Constraints**:
  - Only eligible papers can be assigned reviewers
  - No conference association at assignment time

### Assignment
- **Fields**:
  - `assignmentId` (string, unique)
  - `paperId` (string, required)
  - `reviewerId` (string, required)
  - `status` (enum: pending, accepted, rejected)
  - `requestedAt` (timestamp)
  - `respondedAt` (timestamp, optional)
- **Constraints**:
  - Only one pending/accepted assignment per (paperId, reviewerId)
  - Active assignments count toward reviewer limit

### Violation
- **Fields**:
  - `violationId` (string, unique)
  - `reviewerEmail` (string)
  - `rule` (enum: invalid_email, duplicate_entry, duplicate_assignment, limit_reached, evaluation_failed)
  - `message` (string)

### ReviewRequest
- **Fields**:
  - `requestId` (string, unique)
  - `assignmentId` (string, required)
  - `reviewerEmail` (string, required)
  - `status` (enum: sent, delivered, failed)
  - `sentAt` (timestamp)
- **Constraints**:
  - One request per assignment

## Relationships

- Reviewer 1 : 0..* Assignment
- Paper 1 : 0..* Assignment
- Assignment 1 : 0..1 ReviewRequest
- Assignment 1 : 0..* Violation

## Validation Rules

- Violations are blocking and prevent assignment creation.
- Invalid or duplicate reviewer entries must be reported in violation list.
- Rule evaluation failures and notification failures are logged for admin review.

## State Transitions

- Assignment: `pending` -> `accepted` or `rejected`
- ReviewRequest: `sent` -> `delivered` or `failed`
