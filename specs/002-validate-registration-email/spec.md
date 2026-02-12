# Feature Specification: Validate Registration Email

**Feature Branch**: `002-validate-registration-email`  
**Created**: 2026-01-31  
**Status**: Draft  
**Input**: User description: "UC-02 in a new branch"

## Clarifications

### Session 2026-01-31

- Q: Should email validation reject illegal characters beyond basic format? → A: Yes, enforce a basic allowed character set (letters, digits, ".", "_", "-", "+").

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Validate Registration Email (Priority: P1)

A public user submits the registration form, and the system validates the email format
and uniqueness so registration can continue only when the email is acceptable.

**Why this priority**: Email validation is a required gate for every registration and
prevents invalid or duplicate accounts.

**Independent Test**: A guest submits the form with valid, unique email and proceeds;
invalid or duplicate email blocks continuation with a clear error.

**Acceptance Scenarios** (derived from `lab1_files/S-02.md` and `lab1_files/AT-02.md`):

1. **Given** a user on the registration form with a valid, unique email, **When** they
   submit the form, **Then** the system confirms format and uniqueness and allows
   registration to continue.
2. **Given** a user submits an invalid-format email, **When** validation runs, **Then**
   the system shows an invalid email error and prevents registration from continuing.
3. **Given** a user submits a duplicate email, **When** validation runs, **Then** the
   system shows a duplicate email error and blocks continuation.
4. **Given** the database query fails during uniqueness check, **When** the user submits
   a valid-format email, **Then** the system shows a validation error and blocks
   continuation until the system recovers.

### Edge Cases

- Email with leading/trailing whitespace is handled consistently (trimmed before validation).
- Case-variant emails are treated as duplicates.
- Invalid format short-circuits uniqueness checks.
- Email containing illegal characters (e.g., `<`, `>`, `,`, `;`, spaces) is rejected as invalid format.

### Assumptions & Dependencies

- Email validation uses a defined format rule set (see FR-003).
- Uniqueness is determined against the CMS user account store.
- If the store is unavailable, validation fails safely and registration does not proceed.

### Out of Scope

- Creating user accounts or passwords (handled by separate registration flow).
- Email verification or confirmation workflows.
- External identity providers or SSO.

### Traceability

- Use Case: `lab1_files/UC-02.md`
- Scenarios: `lab1_files/S-02.md`
- Acceptance Tests: `lab1_files/AT-02.md`
- Traceability Map: `/home/ivissers/ece_493/labs/lab2/lab2/specs/002-validate-registration-email/traceability.md`

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST validate registration email format before attempting
  uniqueness checks.
- **FR-002**: System MUST validate uniqueness against existing accounts using
  case-insensitive comparison.
- **FR-003**: Email format is valid only if it contains exactly one "@", at least one
  character before "@", and a domain that contains at least one "." after "@". The
  local-part may contain only letters, digits, ".", "_", "-", and "+".
- **FR-004**: System MUST trim leading/trailing whitespace before email validation.
- **FR-005**: System MUST block registration continuation when email format is invalid
  and display an invalid-format error message that states “Invalid email format” and
  includes one recovery instruction (e.g., “Enter a valid email like name@example.com”).
- **FR-006**: System MUST block registration continuation when email is already
  registered and display a duplicate-email error message that states “Email already
  registered” and includes one recovery instruction (e.g., “Use a different email”).
- **FR-007**: If the uniqueness check fails due to a data-store error, the system MUST
  block continuation, display a validation error message stating “Email cannot be
  validated right now” with one recovery instruction (e.g., “Try again later”), and
  log the failure.
- **FR-008**: When email validation fails, the system MUST NOT create any account or
  partial account state.
- **FR-009**: When email validation succeeds, the system MUST allow registration to
  continue to the next registration step (e.g., password entry or account creation)
  without additional blocking errors.
- **FR-010**: Validation failures MUST write exactly one log entry containing timestamp,
  error type, and email value (trimmed) for each failed validation.
- **FR-011**: If the data store is temporarily unavailable, the system MUST allow the
  user to retry validation after recovery; the retry uses the latest email input.

### Non-Functional Requirements

- **NFR-001**: Email validation (format check + uniqueness lookup) MUST complete within
  200 ms for typical inputs on a development laptop.
- **NFR-002**: Validation error messages MUST be presented with semantic HTML so that
  screen readers announce the error and its recovery instruction.

### Key Entities *(include if feature involves data)*

- **User Account**: Represents a registered user with an email used for uniqueness checks.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of valid, unique emails allow registration to continue without errors.
- **SC-002**: 100% of invalid-format emails are blocked with a clear invalid-format error.
- **SC-003**: 100% of duplicate emails (case-insensitive) are blocked with a duplicate
  error message.
- **SC-004**: 100% of data-store failures during uniqueness checks block continuation
  and record exactly one failure log entry per failed validation.
