# Research: Validate Registration Email

**Date**: 2026-01-31
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/002-validate-registration-email/spec.md

## Decisions

### Email format validation
- **Decision**: Require exactly one "@", at least one character before "@", and a
  domain containing at least one "." after "@". Local-part allowed characters:
  letters, digits, ".", "_", "-", "+".
- **Rationale**: Aligns with clarified spec and balances strictness with usability.
- **Alternatives considered**:
  - Basic format only (no character set restriction)
  - Full RFC validation (too complex for scope)

### Whitespace handling
- **Decision**: Trim leading and trailing whitespace before validation.
- **Rationale**: Matches spec and prevents false negatives/duplicates.
- **Alternatives considered**:
  - Reject whitespace without trimming

### Uniqueness check
- **Decision**: Case-insensitive comparison against existing accounts.
- **Rationale**: Prevents duplicate accounts and aligns with common expectations.
- **Alternatives considered**:
  - Case-sensitive uniqueness

### Failure handling
- **Decision**: If uniqueness check fails due to data-store error, block continuation
  and log the failure.
- **Rationale**: Fail-safe behavior required by spec and AT-02.
- **Alternatives considered**:
  - Allow continuation with warning

### Testing approach
- **Decision**: Use lightweight JS test harness with Node.js `assert` for unit tests
  and browser-based integration/acceptance tests.
- **Rationale**: No external dependencies, aligns with project constraints.
- **Alternatives considered**:
  - Full testing framework
