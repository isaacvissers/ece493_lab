# Data Model: Enter Manuscript Metadata

## Entities

### ManuscriptMetadata
- **Fields**:
  - submissionId
  - authorNames
  - affiliations
  - contactEmail
  - abstract
  - keywords
  - mainSource
  - updatedAt

### MetadataDraft
- **Fields**:
  - submissionId
  - draftData (partial metadata fields)
  - savedAt

### MetadataErrorLog
- **Purpose**: Transient log of save failures (in-memory only).
- **Fields**:
  - timestamp
  - errorType (validation | storage)
  - message
  - context (submissionId)

## Relationships
- Submission 1:1 ManuscriptMetadata
- Submission 1:0..1 MetadataDraft
- Submission 1:0..* MetadataErrorLog

## Validation Rules
- Required fields: author names, affiliations, contact email, abstract, keywords, main source.
- Contact email must be valid format.
- Keywords: 1–10 items, comma-separated.

## State Transitions
- Draft -> Saved metadata (on successful save)
- Failure does not commit changes
