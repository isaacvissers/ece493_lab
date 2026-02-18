# Quickstart: Notify Editor of Assignment Rule Violations

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/015-notify-assignment-violations/spec.md

## Run Tests

```bash
npm test && npm run lint
```

## Feature Validation Checklist

- Invalid assignments show clear in-app messages for each violation.
- Mixed-validity bulk requests return per-entry outcomes.
- Rule evaluation failure blocks assignments and shows retry guidance.
- Notification UI failure shows alternate visible feedback.
- Notification feedback appears within 200 ms under typical load.
- Reviewers receive email requests and can accept/reject.
- Acceptance creates assignment; rejection leaves it unassigned.
- Failures are logged for admin review.
- Review-request delivery failures are surfaced and leave assignments unassigned.
