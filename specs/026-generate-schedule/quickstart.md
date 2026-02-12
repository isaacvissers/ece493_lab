# Quickstart: Generate Conference Schedule

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/026-generate-schedule/spec.md

## Run Tests

```bash
npm test && npm run lint
```

## Feature Validation Checklist

- Generate schedule with valid inputs produces a draft with assigned time/room for each accepted paper.
- Draft schedule persists and can be reopened for review.
- Missing/invalid inputs block generation with clear error indications.
- Capacity shortfall produces partial draft with unscheduled papers flagged.
- Missing metadata papers are excluded and flagged.
- Scheduling conflicts are blocked until admin adjustments are made.
- Save failure displays error and logs the failure without persisting changes.
- Publish failure leaves saved schedule intact and logs the failure.
- Unauthorized access is blocked and logged.
