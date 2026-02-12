# Research: Save Submission Draft

## Decision 1: Draft expiration
- **Decision**: Drafts never expire unless deleted by author or admin.
- **Rationale**: Aligns with UC-12 open issue resolution and avoids unexpected data loss.
- **Alternatives considered**:
  - Auto-expire after fixed period (rejected: not specified in UC-12).

## Decision 2: Draft versioning
- **Decision**: Only the latest draft version is kept (overwrite on save).
- **Rationale**: Matches UC-12 assumption and AT-UC12-03 expectation.
- **Alternatives considered**:
  - Keep multiple versions (rejected: out of scope and not specified).

## Decision 3: Draft save permissiveness
- **Decision**: Draft saves allow incomplete/invalid final fields and may warn, but do not block saving.
- **Rationale**: Matches UC-12 extension 3a and AT-UC12-04.
- **Alternatives considered**:
  - Enforce final validations on draft (rejected: conflicts with UC-12).
