# Quickstart: Edit and Update Conference Schedule

**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/028-edit-schedule/spec.md

## Prerequisites

- Node/npm available
- Run from repository root

## Run

1. Start the app (per lab instructions):
   - `npm test` (or project runner) to verify setup

## Manual Verification

1. Open scheduling UI for a conference with a draft schedule.
2. Edit a schedule entry to a valid room/time and save.
3. Confirm the updated assignment appears in the schedule view and HTML schedule view.
4. Attempt a conflicting edit; confirm save is blocked with conflict message.
5. Attempt an out-of-window edit; confirm save is blocked with allowed window message.
6. Attempt editing with unauthorized user; confirm access is denied and logged.
7. Simulate concurrent edit (version mismatch) and confirm refresh required.
8. Simulate save failure; confirm schedule unchanged and error logged.
9. Trigger notifications after save; confirm failure does not roll back schedule.
10. Run `npm test` to verify unit/integration/acceptance/performance coverage.

## Test Suite

- Unit tests: `tests/unit/`
- Integration tests: `tests/integration/`
- Acceptance tests: `tests/acceptance/`
- Performance tests: `tests/performance/`
