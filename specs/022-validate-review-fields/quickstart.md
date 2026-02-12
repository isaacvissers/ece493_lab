# Quickstart: Validate Review Form Fields

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/022-validate-review-fields/spec.md

## Run Tests

```bash
npm test && npm run lint
```

## Feature Validation Checklist

- Valid inputs save/submit successfully.
- Blank required fields block submission with field + summary errors.
- Invalid characters block save/submit with rule message.
- Multiple errors show consolidated summary and all fields highlighted.
- Length limits block action with max-length guidance (if configured).
- Validation rules unavailable blocks action and logs.
- Storage failure after validation shows error and logs.
