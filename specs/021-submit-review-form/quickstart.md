# Quickstart: Submit Completed Review Form

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/021-submit-review-form/spec.md

## Run Tests

```bash
npm test && npm run lint
```

## Feature Validation Checklist

- Valid review submissions are stored and marked submitted.
- Required-field validation blocks submission with field errors and summary.
- Duplicate submissions are blocked with a finality message.
- Closed review periods block submission and allow view-only access.
- Unauthorized submission attempts are denied.
- Submission failures preserve drafts and log errors.
- Optional editor notifications are logged on success/failure.
