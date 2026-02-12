# Quickstart: Access Review Form for Assigned Papers

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/020-access-review-form/spec.md

## Run Tests

```bash
npm test && npm run lint
```

## Feature Validation Checklist

- Accepted assignments can open the review form.
- Draft review loads when present.
- Unauthorized or unaccepted access is blocked.
- Closed review period allows view-only access.
- Missing form configuration shows error and logs.
- Form retrieval failures show error and allow retry.
