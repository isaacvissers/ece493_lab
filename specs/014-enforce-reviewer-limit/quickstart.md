# Quickstart: Enforce Reviewer Assignment Limit

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/014-enforce-reviewer-limit/spec.md

## Run Tests

```bash
npm test && npm run lint
```

## Feature Validation Checklist

- Reviewer assignment is allowed when active assignments < 5.
- Reviewer assignment is blocked at 5 active assignments.
- Bulk assignment partially applies and reports per-reviewer outcomes.
- Lookup or save failures block assignment and report errors.
- Concurrent assignments do not allow exceeding 5 active assignments.
