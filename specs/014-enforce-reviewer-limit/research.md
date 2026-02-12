# Research Notes: Enforce Reviewer Assignment Limit

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/014-enforce-reviewer-limit/spec.md

## Decisions

### Decision 1: Global limit with active-only counting
- **Decision**: Enforce a maximum of 5 active assignments per reviewer across all papers.
- **Rationale**: Clarifications resolved UC-14 open issues; global scope fits the
  "no conference association" constraint at assignment time.
- **Alternatives considered**: Per conference; per track within a conference.

### Decision 2: Partial-apply bulk assignment
- **Decision**: For bulk reviewer assignment, apply eligible assignments and block only those at/over limit.
- **Rationale**: Reduces editor rework while preserving limit enforcement.
- **Alternatives considered**: All-or-nothing batch rejection.

### Decision 3: Fail-safe on lookup/save failures
- **Decision**: Block assignments if reviewer count cannot be determined or save fails.
- **Rationale**: Prevents over-assignment and inconsistent state.
- **Alternatives considered**: Best-effort assignment with later reconciliation.

### Decision 4: No overrides
- **Decision**: Editors (or admins) cannot override the limit.
- **Rationale**: Maintains fairness and simplifies policy enforcement.
- **Alternatives considered**: Admin or editor override with justification.
