# Quickstart: View Conference Schedule (HTML)

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/027-view-schedule/spec.md

## Run Tests

```bash
npm test
# npm run lint (if available)
```

## Feature Validation Checklist

- Published schedule renders as HTML agenda list grouped by room.
- Time/room assignments are visible for each scheduled item.
- No schedule shows “No schedule available” message.
- Unscheduled items appear in a separate “Unscheduled” section.
- Unauthorized access shows error and logs attempt.
- Rendering failure shows error and logs failure.
- Large schedule shows loading indicator and completes within timeout or shows timeout error.
