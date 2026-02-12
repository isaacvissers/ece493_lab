# Data Model: Validate Paper Submission Fields

## Entities

### SubmissionMetadata
- **Fields**:
  - authorNames
  - affiliations
  - contactEmail
  - abstract
  - keywords
  - mainSource

### ManuscriptFile
- **Fields**:
  - filename
  - fileType

### ValidationErrors
- **Fields**:
  - field
  - message

### DraftSubmission
- **Fields**:
  - metadata (partial SubmissionMetadata)
  - manuscriptFile (optional)
  - savedAt

## Relationships
- Submission 1:1 SubmissionMetadata
- Submission 1:0..1 ManuscriptFile
- Submission 1:0..1 DraftSubmission
- Submission 1:0..* ValidationErrors

## Validation Rules
- Required fields on final submit: author names, affiliations, contact email, abstract, keywords, main source, manuscript file.
- Contact email must be valid format.
- Manuscript file type must be one of .pdf, .doc, .docx, .tex.
- Draft saves validate provided email and file type formats only.

## State Transitions
- Draft -> Final submission (only when all final validations pass)
- Validation failures block final submission
