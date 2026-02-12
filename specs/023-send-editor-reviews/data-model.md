# Data Model: Send Completed Reviews to the Editor

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/023-send-editor-reviews/spec.md

## Entities

### Review
- **Fields**:
  - `reviewId` (string, unique)
  - `paperId` (string, required)
  - `reviewerId` (string, required)
  - `status` (enum: draft, submitted)
  - `content` (object)
  - `submittedAt` (timestamp, optional)

### Paper
- **Fields**:
  - `paperId` (string, unique)
  - `editorId` (string, optional)

### Editor
- **Fields**:
  - `editorId` (string, unique)
  - `permissions` (array of permission keys)

### DeliveryEvent
- **Fields**:
  - `deliveryId` (string, unique)
  - `reviewId` (string, required)
  - `editorId` (string, required)
  - `deliveredAt` (timestamp)
  - `status` (enum: delivered, failed)
  - `reason` (string, optional)

### Notification
- **Fields**:
  - `notificationId` (string, unique)
  - `reviewId` (string, required)
  - `editorId` (string, required)
  - `channels` (array: email, in_app)
  - `status` (enum: sent, failed)
  - `sentAt` (timestamp, optional)
  - `reason` (string, optional)

### AuditLog
- **Fields**:
  - `logId` (string, unique)
  - `eventType` (enum: delivery, notification, error)
  - `relatedId` (string, required)
  - `createdAt` (timestamp)
  - `details` (object)

## Relationships

- Paper 1 : 0..1 Editor (assigned editor may be missing)
- Paper 1 : 0..* Review
- Review 1 : 0..* DeliveryEvent (idempotent per review)
- Review 1 : 0..* Notification (one per review per channel when enabled)
- DeliveryEvent 1 : 0..* AuditLog
- Notification 1 : 0..* AuditLog

## Validation Rules

- Delivery triggers only when Review.status = submitted.
- Duplicate delivery attempts for the same review are suppressed.
- Notifications are optional; when enabled, both email and in-app are sent.
- Missing editor mapping results in a flagged error and no delivery target.
- Authorization failures are logged and deny access without altering review state.

## State Transitions

- Review: `draft` -> `submitted`
- DeliveryEvent: `delivered` or `failed` (no rollback of Review)
- Notification: `sent` or `failed` (no rollback of Review)
