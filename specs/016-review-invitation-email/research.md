# Research Notes: Receive Review Invitation by Email

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/016-review-invitation-email/spec.md

## Decisions

### Decision 1: Invitation links expire after 7 days
- **Decision**: Set invitation link expiration to 7 days.
- **Rationale**: Balanced window for reviewer response without stale invites.
- **Alternatives considered**: 24 hours; 14 days.

### Decision 2: No login required for response
- **Decision**: Reviewers can respond via email links without logging in.
- **Rationale**: Simplifies response flow and matches use case assumptions.
- **Alternatives considered**: Require login before respond.

### Decision 3: Fail-safe on delivery/record failures
- **Decision**: Keep invitations pending on send failure; keep assignment unchanged on record failure; log failures.
- **Rationale**: Prevents inconsistent assignment state.
- **Alternatives considered**: Best-effort record without confirmation.
