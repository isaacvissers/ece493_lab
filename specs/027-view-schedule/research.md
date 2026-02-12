# Research: View Conference Schedule (HTML)

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/027-view-schedule/spec.md

## Decisions

- **Decision**: Render schedule as an agenda list grouped by room.
  **Rationale**: Clear and scannable for review without complex grid UI.
  **Alternatives considered**: Room/time grid (rejected; heavier layout complexity).

- **Decision**: Show published schedule only in HTML view.
  **Rationale**: Prevents exposing unreviewed drafts.
  **Alternatives considered**: Draft-first or toggle (rejected; not required in UC-27).

- **Decision**: Place unscheduled items in a separate “Unscheduled” section.
  **Rationale**: Preserves readability while surfacing incomplete data.
  **Alternatives considered**: Inline placement or hiding unscheduled items (rejected).
