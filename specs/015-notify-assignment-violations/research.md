# Research Notes: Notify Editor of Assignment Rule Violations

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/015-notify-assignment-violations/spec.md

## Decisions

### Decision 1: Partial-apply for bulk assignment
- **Decision**: Save valid assignments and block invalid ones with per-entry reasons.
- **Rationale**: Reduces editor rework while enforcing rule violations clearly.
- **Alternatives considered**: All-or-nothing bulk rejection.

### Decision 2: Reviewer email requests with accept/reject
- **Decision**: Send email to reviewers; acceptance creates assignment, rejection leaves it unassigned.
- **Rationale**: Matches clarified workflow and preserves reviewer consent.
- **Alternatives considered**: In-app notifications only.

### Decision 3: All violations are blocking
- **Decision**: Treat all assignment rule violations as blocking.
- **Rationale**: Aligns with clarified scope and avoids warning-only ambiguity.
- **Alternatives considered**: Mixed blocking vs warning rules.

### Decision 4: Log evaluation and notification failures
- **Decision**: Log both rule-evaluation failures and notification UI failures for admin review.
- **Rationale**: Required by clarifications and UC-15 extensions.
- **Alternatives considered**: Log evaluation failures only.
