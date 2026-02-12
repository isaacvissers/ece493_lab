# Data Model: Upload Manuscript File Within Constraints

## Entities

### ManuscriptFile
- **Fields**:
  - id
  - originalName
  - fileType (pdf | docx | tex)
  - fileSizeBytes
  - uploadedAt

### SubmissionAttachment
- **Fields**:
  - submissionId
  - manuscriptFileId
  - attachedAt

### UploadErrorLog
- **Purpose**: Transient log of upload/storage failures (in-memory only).
- **Fields**:
  - timestamp
  - errorType (upload | storage)
  - message
  - context (submissionId)

## Relationships
- Submission 1:1 SubmissionAttachment
- SubmissionAttachment 1:1 ManuscriptFile
- Submission 1:0..* UploadErrorLog

## Validation Rules
- File type must be `.pdf`, `.docx`, or `.tex`.
- File size must be <= 7MB.

## State Transitions
- Upload -> Attached (on success)
- Failure does not attach
