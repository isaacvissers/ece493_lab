# Quickstart: Send Completed Reviews to the Editor

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/023-send-editor-reviews/spec.md

## Run Tests

```bash
npm test && npm run lint
```

## Feature Validation Checklist

- Submitted reviews appear in the assigned editor’s in-app review list.
- Failed submissions do not trigger delivery or notifications.
- Notifications (when enabled) are sent via both email and in-app channels.
- Notification failures do not block in-app visibility and are logged.
- Missing editor mapping is flagged and logged without data loss.
- Authorization misconfiguration denies access and logs the error.
- Duplicate delivery attempts are suppressed.
- Batch submissions show all reviews in-app; notifications follow configuration.
- Audit/log failures do not remove editor access.
