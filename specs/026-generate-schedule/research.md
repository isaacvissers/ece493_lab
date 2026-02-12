# Research: Generate Conference Schedule

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/026-generate-schedule/spec.md

## Decisions

- **Decision**: Use deterministic, constraint-respecting draft generation with conflict blocking and admin correction.
  **Rationale**: Matches UC-26 requirements and avoids hidden conflicts.
  **Alternatives considered**: Auto-resolve conflicts with heuristic adjustments (rejected; could violate admin intent).

- **Decision**: Allow empty draft schedules when no accepted papers exist.
  **Rationale**: Keeps workflow consistent and supports early planning.
  **Alternatives considered**: Block generation on empty set (rejected; unnecessary friction).

- **Decision**: Exclude and flag papers with missing scheduling metadata.
  **Rationale**: Avoids silent defaults that could misrepresent session needs.
  **Alternatives considered**: Apply defaults or prompt per-paper (deferred to manual editing, out of scope).
