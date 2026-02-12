# Research: Register an Account

**Date**: 2026-01-31
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/001-register-account/spec.md

## Decisions

### Data persistence approach
- **Decision**: Use browser localStorage with an in-memory cache to simulate the CMS
  database for registration data and session state.
- **Rationale**: Matches vanilla HTML/CSS/JS constraint and allows persistence across
  page reloads without adding external dependencies.
- **Alternatives considered**:
  - In-memory only (no persistence across reloads)
  - External database/API (adds backend complexity beyond current lab scope)

### Email validation criteria
- **Decision**: Require exactly one “@”, at least one character before “@”, and a
  domain containing at least one “.” after “@”.
- **Rationale**: Meets clarified spec with simple, testable rules suitable for client-side
  validation without external dependencies.
- **Alternatives considered**:
  - Strict RFC-complete validation (complex for this scope)

### Password validation policy
- **Decision**: Enforce minimum 8 characters with at least one number and one symbol.
- **Rationale**: Aligns with clarified spec and provides a clear, testable baseline.
- **Alternatives considered**:
  - 8 characters only
  - 12-character strong policy (higher friction for basic registration)

### Error messaging standard
- **Decision**: Error messages must identify the invalid field or failure cause and
  include one recovery instruction.
- **Rationale**: Directly reflects spec requirements and enables consistent UX.
- **Alternatives considered**:
  - Generic error text without recovery guidance

### Post-registration behavior
- **Decision**: Auto-login user and redirect to dashboard after successful registration.
- **Rationale**: Clarified requirement; improves user flow by reducing steps.
- **Alternatives considered**:
  - Redirect to login (no auto-login)

### Email uniqueness handling
- **Decision**: Case-insensitive uniqueness check for email addresses, treating
  case-variant inputs as duplicates.
- **Rationale**: Prevents duplicate accounts and aligns with common expectations.
- **Alternatives considered**:
  - Case-sensitive uniqueness

### Accessibility baseline
- **Decision**: Full keyboard operability with visible focus states; error messages
  are associated with fields and perceivable by screen readers.
- **Rationale**: Matches non-functional requirements and supports consistent UX.
- **Alternatives considered**:
  - Keyboard-only support without screen reader cues

### Retry-after-failure state
- **Decision**: Retries must preserve a clean state with no partial account; email
  remains available unless a successful registration occurred.
- **Rationale**: Matches clarified FR-009a and prevents phantom duplicates.
- **Alternatives considered**:
  - Best-effort retries without explicit state guarantees

### Testing approach
- **Decision**: Use a lightweight JS test harness with Node.js `assert` for unit tests
  and browser-based integration/acceptance tests.
- **Rationale**: No external frameworks while still covering required test types.
- **Alternatives considered**:
  - Full testing framework (adds dependencies)
