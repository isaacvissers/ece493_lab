# Feature Specification: Reject Invalid Login Credentials

**Feature Branch**: `006-reject-invalid-login`  
**Created**: 2026-02-01  
**Status**: Draft  
**Input**: User description: "UC-06 in branch numbered 006"

## Clarifications

### Session 2026-02-01

- Q: What error message policy should be used for invalid credentials? → A: Use a single generic message for all invalid credentials.
- Q: Should invalid-credential logging be persisted? → A: Transient logging only (no persistence).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Reject Invalid Login Credentials (Priority: P1)

A registered user attempts to log in with invalid credentials and is rejected so
unauthorized access is prevented and the user receives a generic error message.

**Why this priority**: Preventing access on invalid credentials is fundamental to
system security and is required for every login attempt.

**Independent Test**: Submit invalid login credentials and confirm the system rejects
login, keeps the user unauthenticated, shows a generic error, and allows retry.

**Acceptance Scenarios** (derived from `lab1_files/S-06.md` and `lab1_files/AT-06.md`):

1. **Given** a user submits an incorrect password, **When** the system validates
   credentials, **Then** the login is rejected, a generic invalid-credentials error
   is shown, and the user remains on the login page.
2. **Given** a user submits a non-existent email, **When** the system validates
   credentials, **Then** the login is rejected and the same generic invalid-credentials
   error is shown.
3. **Given** invalid credentials for both missing-user and wrong-password cases,
   **When** the user submits, **Then** the error message is identical and does not
   reveal whether the account exists.
4. **Given** an invalid login attempt, **When** the user tries to access protected
   pages afterward, **Then** access is blocked and the user remains unauthenticated.
5. **Given** a database lookup failure, **When** the user submits invalid credentials,
   **Then** the system rejects login, shows a login-unavailable error, logs the failure,
   and prevents authentication.
6. **Given** a sensitive error message is detected (e.g., “username not found”),
   **When** it would be shown, **Then** the system replaces it with a generic invalid
   credentials error and logs the issue.

### Edge Cases

- User submits whitespace-only credentials.
- User repeatedly retries with invalid credentials (no lockout in this feature).
- Database lookup outage prevents credential validation.

### Assumptions & Dependencies

- The login identifier is the email address (same as registration identifier).
- The user is on the login page and currently logged out.
- No lockout, rate limiting, CAPTCHA, or MFA is required for this feature.
- Login error logging is transient (no persistence required).

### Out of Scope

- Account lockout, retry limits, CAPTCHA, MFA, or password reset flows.
- Successful login flow (handled by UC-05).

### Traceability

- Use Case: `lab1_files/UC-06.md`
- Scenarios: `lab1_files/S-06.md`
- Acceptance Tests: `lab1_files/AT-06.md`

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST reject login attempts when credentials are invalid.
- **FR-002**: For non-existent email or incorrect password, the system MUST display
  the same generic invalid-credentials error that does not reveal which field is wrong.
- **FR-002a**: The generic invalid-credentials error MUST be used for all invalid
  credential cases (missing user or wrong password) without variation.
- **FR-003**: The user MUST remain unauthenticated and stay on the login page after
  invalid credentials.
- **FR-004**: If a sensitive error message is detected, the system MUST replace it
  with the generic invalid-credentials error and log the issue (transient).
- **FR-005**: If database lookup fails, the system MUST reject login, show a
  login-unavailable error, and log the failure (transient).
- **FR-006**: After any invalid login attempt, access to protected pages MUST remain
  blocked.
- **FR-007**: The system MUST allow the user to retry login after an invalid attempt.

### Key Entities *(include if feature involves data)*

- **User Account**: Stored user credentials and account status.
- **Session State**: Tracks whether a user is authenticated.
- **Login Failure Log**: Captures invalid-credential and lookup failure events (transient).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of invalid credential submissions are rejected and do not
  authenticate the user.
- **SC-002**: 100% of invalid credential errors use a generic message that does not
  reveal account existence.
- **SC-003**: 100% of database lookup failures show a login-unavailable error and are logged.
- **SC-004**: 100% of post-failure protected-page attempts remain blocked.
- **SC-005**: 100% of sensitive error messages are replaced with a generic message.

### Non-Functional Requirements

- **NFR-001**: Invalid-credential rejection MUST complete within 2 seconds for typical
  users on a development laptop.
- **NFR-002**: Error messages MUST be accessible using semantic HTML and keyboard
  navigation.
