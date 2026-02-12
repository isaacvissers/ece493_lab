# Research: Upload Manuscript File Within Constraints

## Decision 1: File persistence approach
- **Decision**: Persist file metadata and attachment info in localStorage; keep upload content in memory for the current session.
- **Rationale**: Matches project constraints and avoids storing binary data in localStorage.
- **Alternatives considered**:
  - Base64 store file in localStorage (rejected: size limits/perf).
  - IndexedDB storage (rejected: extra complexity).

## Decision 2: Replace behavior
- **Decision**: New valid upload replaces the prior attachment before final submission.
- **Rationale**: Aligns with UC-09 open issue and keeps single attachment model.
- **Alternatives considered**:
  - Version history of uploads (rejected: out of scope).

## Decision 3: Error logging
- **Decision**: Log upload/storage failures transiently in memory; do not persist.
- **Rationale**: Keeps privacy and storage scope minimal.
- **Alternatives considered**:
  - Persist logs in localStorage (rejected: unnecessary retention).

