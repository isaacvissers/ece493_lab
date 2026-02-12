# Research: Validate Paper Submission Fields

## Decision 1: Draft validation scope
- **Decision**: Draft saves bypass required-field checks but validate provided email and file-type formats.
- **Rationale**: Matches UC-11 extension 2b while preventing obviously invalid formats from persisting.
- **Alternatives considered**:
  - Skip all validation on draft (rejected: allows invalid formats to persist).
  - Enforce full validations on draft (rejected: conflicts with UC-11 permissive draft intent).

## Decision 2: Accepted manuscript file extensions
- **Decision**: Accept .pdf, .doc, .docx, .tex.
- **Rationale**: Aligns with UC-11 accepted formats (PDF, Word, LaTeX) with explicit extensions.
- **Alternatives considered**:
  - Only .pdf/.docx (rejected: excludes .doc and .tex).
  - Include .latex (rejected: not specified in UC-11 artifacts).

## Decision 3: Required fields on final submit
- **Decision**: Required fields are author names, affiliations, contact email, abstract, keywords, main source, and manuscript file.
- **Rationale**: Matches UC-11 assumptions and UC-10 metadata requirements.
- **Alternatives considered**:
  - Make affiliations optional (rejected: not supported by UC-11 requirements).
  - Minimal required fields (rejected: conflicts with UC-11 intent).
