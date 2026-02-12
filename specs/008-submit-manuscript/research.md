# Research: Submit Paper Manuscript

## Decision 1: Local-only storage strategy
- **Decision**: Persist manuscript metadata and draft state in localStorage; keep file content in memory during the current session. Store file metadata (name, size, type) with the manuscript record.
- **Rationale**: LocalStorage is the project’s standard simulated persistence; storing binary file content there is brittle and unnecessary for the assignment’s scope.
- **Alternatives considered**:
  - Base64-encode and store file content in localStorage (rejected: size limits, performance risk).
  - IndexedDB for file content (rejected: adds complexity without requirements).

## Decision 2: Draft persistence
- **Decision**: Save draft metadata + optional file metadata in localStorage keyed by author/session.
- **Rationale**: Supports partial progress without introducing server APIs.
- **Alternatives considered**:
  - Only in-memory drafts (rejected: loses draft on refresh).

## Decision 3: Error logging
- **Decision**: Use an in-memory error log for submission/storage failures; do not persist logs.
- **Rationale**: Matches requirement for transient logging and avoids privacy retention concerns.
- **Alternatives considered**:
  - Persist logs in localStorage (rejected: unnecessary persistence).

