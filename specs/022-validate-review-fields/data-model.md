# Data Model: Validate Review Form Fields

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/022-validate-review-fields/spec.md

## Entities

### ReviewForm
- **Fields**:
  - `formId` (string, unique)
  - `requiredFields` (array of field keys)
  - `allowedCharactersRule` (string description)
  - `maxLengths` (map of field key -> max length)

### ReviewDraft
- **Fields**:
  - `draftId` (string, unique)
  - `paperId` (string, required)
  - `reviewerId` (string, required)
  - `content` (object)
  - `validationErrors` (object, optional)
  - `updatedAt` (timestamp)

### SubmittedReview
- **Fields**:
  - `submissionId` (string, unique)
  - `paperId` (string, required)
  - `reviewerId` (string, required)
  - `content` (object)
  - `submittedAt` (timestamp)

### ValidationError
- **Fields**:
  - `fieldKey` (string, optional)
  - `message` (string, required)
  - `type` (enum: required, invalid_chars, max_length, rules_unavailable)

### ValidationRuleSet
- **Fields**:
  - `ruleSetId` (string, unique)
  - `requiredFields` (array of field keys)
  - `invalidCharacterPolicy` (enum: no_control_chars_no_markup)
  - `maxLengths` (map of field key -> max length)

## Relationships

- ReviewForm 1 : 0..* ValidationRuleSet (effective rules per form)
- ReviewDraft 1 : 0..* ValidationError (for UI display)

## Validation Rules

- Required fields must be present on submission.
- Drafts may be saved with blank required fields.
- Invalid characters are control characters or markup/script tags.
- Max length constraints are enforced when configured.
- If rules are unavailable, save/submit is blocked and the issue logged.

## State Transitions

- ReviewDraft: `draft` -> `submitted`
