# Data Model: Validate Registration Email

**Date**: 2026-01-31
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/002-validate-registration-email/spec.md

## Entities

### UserAccount

**Description**: Represents a registered user used for email uniqueness checks.

**Fields**:
- `id` (string): unique identifier
- `email` (string): required; unique (case-insensitive)

**Validation Rules**:
- Trim leading/trailing whitespace before validation.
- Email format: exactly one "@", at least one character before "@", and a domain
  containing at least one "." after "@".
- Local-part allowed characters: letters, digits, ".", "_", "-", "+".
- Uniqueness enforced case-insensitively.

**State Transitions**:
- Not applicable (validation-only feature).

## Relationships

- None for this feature (single entity scope).
