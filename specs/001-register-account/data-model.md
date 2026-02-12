# Data Model: Register an Account

**Date**: 2026-01-31
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/001-register-account/spec.md

## Entities

### UserAccount

**Description**: Represents a CMS user account created via registration.

**Fields**:
- `id` (string): unique identifier
- `email` (string): required; must be valid format; unique (case-insensitive)
- `password` (string): required; minimum 8 chars, includes number + symbol
- `createdAt` (string): ISO timestamp

**Validation Rules**:
- Email format: exactly one “@”, at least one character before “@”, and a domain
  containing at least one “.” after “@”.
- Email uniqueness enforced case-insensitively; case-variant inputs are duplicates.
- Password must be at least 8 characters and include at least one digit and one symbol.

**State Transitions**:
- Guest → Registered (account created)
- Registered → Authenticated (auto-login after registration)

## Relationships

- None for this feature (single entity scope).
