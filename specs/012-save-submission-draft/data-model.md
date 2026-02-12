# Data Model: Save Submission Draft

## Entities

### DraftSubmission
- **Fields**:
  - metadata (partial submission fields)
  - manuscriptFileRef (optional)
  - updatedAt

### DraftSaveState
- **Fields**:
  - submissionId
  - lastSavedAt

### DraftErrorLog
- **Fields**:
  - timestamp
  - errorType (save | load)
  - message
  - context (submissionId)

## Relationships
- Submission 1:0..1 DraftSubmission
- Submission 1:1 DraftSaveState
- Submission 1:0..* DraftErrorLog

## Validation Rules
- Draft saves allow incomplete/invalid final fields.
- Draft save overwrites previous draft state.
- Save/load failures do not alter last saved state.

## State Transitions
- Draft saved -> Draft saved (overwrite)
- Draft save failure -> Previous draft preserved
- Draft load failure -> Editing blocked until resolved
