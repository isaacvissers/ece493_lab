# Quickstart: Receive Editor’s Decision

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/025-author-decision/spec.md

## Run Tests

```bash
npm test && npm run lint
```

## Feature Validation Checklist

- Released decisions appear in My Submissions for submitting author.
- Notifications (when enabled) are delivered to all co-authors.
- Notification failures do not block in-app visibility and are logged.
- Invalid email falls back to in-app notification when supported.
- Unauthenticated author is prompted to log in and returned to decision view.
- Non-author access is denied and logged.
- Staged releases show Pending until release time.
- Optional notes are shown only when present.
