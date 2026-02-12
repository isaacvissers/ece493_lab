# Data Model: Receive Review Invitation by Email

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/016-review-invitation-email/spec.md

## Entities

### ReviewInvitation
- **Fields**:
  - `invitationId` (string, unique)
  - `paperId` (string, required)
  - `reviewerEmail` (string, required)
  - `status` (enum: pending, accepted, rejected, expired)
  - `sentAt` (timestamp)
  - `expiresAt` (timestamp)
- **Constraints**:
  - Links are single-use
  - Invitations expire after 7 days

### Reviewer
- **Fields**:
  - `reviewerId` (string, unique)
  - `email` (string, unique)

### Paper
- **Fields**:
  - `paperId` (string, unique)
  - `status` (enum: submitted, eligible, in_review, withdrawn, completed)

### Assignment
- **Fields**:
  - `assignmentId` (string, unique)
  - `paperId` (string, required)
  - `reviewerId` (string, required)
  - `status` (enum: pending, accepted, rejected)
  - `respondedAt` (timestamp, optional)

## Relationships

- Paper 1 : 0..* ReviewInvitation
- Reviewer 1 : 0..* ReviewInvitation
- ReviewInvitation 1 : 0..1 Assignment (on accept/reject)
- Paper 1 : 0..* Assignment
- Reviewer 1 : 0..* Assignment

## Validation Rules

- Invalid or expired links must not record a response.
- Duplicate responses must be rejected.
- Send/record failures are logged and leave assignment status unchanged.

## State Transitions

- ReviewInvitation: `pending` -> `accepted` or `rejected` or `expired`
- Assignment: `pending` -> `accepted` or `rejected`
