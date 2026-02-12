# Research: Enter Manuscript Metadata

## Decision 1: Draft persistence
- **Decision**: Store draft metadata in localStorage keyed by submission.
- **Rationale**: Matches project constraints and supports partial progress.
- **Alternatives considered**:
  - In-memory only (rejected: loses draft on refresh).

## Decision 2: Keywords validation
- **Decision**: Enforce 1–10 keywords, comma-separated.
- **Rationale**: Provides concrete constraints for validation and aligns with clarification.
- **Alternatives considered**:
  - No limits (rejected: too vague).

## Decision 3: Error logging
- **Decision**: Log database/save failures transiently in memory; do not persist.
- **Rationale**: Avoids retention while supporting admin review signals.
- **Alternatives considered**:
  - Persist logs in localStorage (rejected: unnecessary retention).

