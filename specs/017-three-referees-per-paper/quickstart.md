# Quickstart: Ensure Exactly Three Referees per Paper

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/017-three-referees-per-paper/spec.md

## Run Tests

```bash
npm test && npm run lint
```

## Feature Validation Checklist

- Readiness is allowed only with exactly three non-declined assignments.
- Readiness blocks and shows current count when fewer than three.
- Readiness blocks and shows current count when more than three.
- Add/remove guidance is available when count is incorrect.
- Attempts to add a fourth non-declined assignment are blocked.
- Count lookup failures block readiness and are logged.
- Missing invitations are flagged when enabled and count is three.
