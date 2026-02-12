# Quickstart: Alert Editor on Reviewer Over-Assignment

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/019-alert-overassignment/spec.md

## Run Tests

```bash
npm test && npm run lint
```

## Feature Validation Checklist

- Over-assignment attempts are blocked and alert the editor with current count.
- Over-assigned papers show alerts on view.
- Batch overages partially apply and identify blocked additions.
- Count lookup failures block assignment, show error, and log.
- Alert UI failures show alternate message and log.
