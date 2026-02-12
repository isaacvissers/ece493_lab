# Quickstart: Final Schedule Delivery to Authors

**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/029-final-schedule-delivery/spec.md

## Prerequisites

- Node/npm available
- Run from repository root

## Run

1. Start the app (per lab instructions):
   - `npm test` (or project runner) to verify setup

## Manual Verification

1. Publish the schedule for a conference with accepted papers.
2. Log in as an accepted author and view schedule details (time/room).
3. Confirm “Schedule not available yet” appears before publication.
4. Verify “Unscheduled” appears for accepted papers without assignments.
5. Simulate notification failure; confirm in-app access still works and failure is logged.
6. Attempt access as unauthorized author; confirm access denied and logged.

## Test Suite

- Unit tests: `tests/unit/`
- Integration tests: `tests/integration/`
- Acceptance tests: `tests/acceptance/`
- Performance tests: `tests/performance/`
