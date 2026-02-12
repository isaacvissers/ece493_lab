# Research: Edit and Update Conference Schedule

**Date**: 2026-02-03  
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/028-edit-schedule/spec.md

## Decisions

### Decision 1: Unscheduling policy
- **Decision**: Unscheduling without a new assignment is not allowed.
- **Rationale**: Prevents accidental loss of schedule coverage and aligns with FR-010.
- **Alternatives considered**: Allow unscheduling with “Unscheduled” section; allow with required reason.

### Decision 2: Schedule state handling
- **Decision**: Edits apply to draft schedule only; publish is a separate step.
- **Rationale**: Avoids immediate public impact and supports review before publication.
- **Alternatives considered**: Directly update published schedule; create new version on edit.

### Decision 3: Notifications after updates
- **Decision**: Notify authors/attendees after updates are saved.
- **Rationale**: Keeps stakeholders informed of schedule changes.
- **Alternatives considered**: No notifications; notify editors/admins only.
