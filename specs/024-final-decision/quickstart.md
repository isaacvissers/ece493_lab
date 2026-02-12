# Quickstart: Make Final Accept/Reject Decision

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/024-final-decision/spec.md

## Run Tests

```bash
npm test && npm run lint
```

## Feature Validation Checklist

- Eligible papers (exactly 3 completed reviews) appear in decision queue.
- Editor can view three reviews before deciding.
- Accept/Reject decision saves and updates paper status.
- Missing decision selection blocks save with prompt.
- Fewer or more than three reviews block decision and show count.
- Unauthorized editors are blocked and logged.
- DB write failure shows error and leaves status unchanged.
- Notification failure after save does not roll back decision.
