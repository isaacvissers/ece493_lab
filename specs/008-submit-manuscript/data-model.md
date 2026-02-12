# Data Model: Submit Paper Manuscript

## Entities

### Manuscript
- **Fields**:
  - id
  - title
  - authorNames
  - affiliations
  - contactEmail
  - abstract
  - keywords
  - mainSource
  - status (draft | submitted)
  - createdAt
  - updatedAt

### SubmissionFile
- **Fields**:
  - manuscriptId
  - originalName
  - fileType (pdf | docx | tex)
  - fileSizeBytes

### SubmissionDraft
- **Fields**:
  - manuscriptId
  - draftData (partial metadata fields)
  - draftFileMetadata (optional SubmissionFile fields)
  - savedAt

### SubmissionErrorLog
- **Purpose**: Transient log of submission/storage failures (in-memory only).
- **Fields**:
  - timestamp
  - errorType (upload | storage)
  - message
  - context (manuscriptId or draftId)

## Relationships
- Manuscript 1:1 SubmissionFile
- Manuscript 1:0..1 SubmissionDraft
- Manuscript 1:0..* SubmissionErrorLog

## Validation Rules
- Required metadata: title, author names, affiliations, contact email, abstract, keywords, main source.
- Email must be valid format.
- File type must be pdf/docx/tex.
- File size <= 7MB.

## State Transitions
- Draft -> Submitted (only when required metadata + valid file present).
- Failed submission does not change status.
