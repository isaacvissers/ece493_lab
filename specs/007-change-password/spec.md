# Feature Specification: Change Password

**Feature Branch**: `007-change-password`  
**Created**: 2026-02-01  
**Status**: Draft  
**Input**: User description: "UC-07 name the branch correctly"

## Clarifications

### Session 2026-02-01

- Q: Which password policy should apply? → A: Reuse the existing registration password policy (min 8 chars, number + symbol).
- Q: Should the user remain authenticated after a successful change? → A: Keep the user logged in after password change.
- Q: Is confirmation required for the new password? → A: Yes, confirmation is required.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Change Password (Priority: P1)

A logged-in user changes their password by providing their current password and a
new compliant password, and receives confirmation of the update.

**Why this priority**: Password change is a core account security capability for
all users and must work reliably.

**Independent Test**: A logged-in user submits a valid password change and the
system updates the password, confirms success, and keeps the session valid.

**Acceptance Scenarios** (derived from `lab1_files/S-07.md` and `lab1_files/AT-07.md`):

1. **Given** a logged-in user, **When** they submit correct current password and a
   compliant new password, **Then** the system updates the password and shows a
   success confirmation.
2. **Given** required fields are blank, **When** the user submits, **Then** the
   system rejects the request and shows a required-fields error.
3. **Given** the current password is incorrect, **When** the user submits, **Then**
   the system rejects the request and shows a current-password-incorrect error.
4. **Given** the new password does not meet security standards, **When** the user
   submits, **Then** the system rejects the request and shows a policy-violation error.
5. **Given** the new password and confirmation do not match (if confirmation required),
   **When** the user submits, **Then** the system rejects the request and shows a
   passwords-do-not-match error.
6. **Given** a database update failure, **When** the user submits, **Then** the
   system shows a password-change-unavailable error, logs the failure, and does not
   change the password.
7. **Given** the session is expired, **When** the user attempts to change password,
   **Then** the system redirects to login and requires re-authentication.
8. **Given** a successful password change, **When** the user logs out and logs back in,
   **Then** the new password works and the old password does not.

### Edge Cases

- User submits whitespace-only values in password fields.
- Policy service/lookup is unavailable when validating the new password.
- User retries after a failed password change.

### Assumptions & Dependencies

- User is authenticated before accessing change-password flow.
- Password security standards are the same as registration (min 8 chars, number + symbol).
- Password confirmation is required for this feature.
- Logging for update failures is available (transient; no persistence required).

### Out of Scope

- Account lockout, MFA, or password history/reuse prevention.
- Registration and login flows (handled by other features).

### Traceability

- Use Case: `lab1_files/UC-07.md`
- Scenarios: `lab1_files/S-07.md`
- Acceptance Tests: `lab1_files/AT-07.md`

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST require the user to be authenticated to access change-password.
- **FR-002**: System MUST prompt for current password, new password, and confirmation.
- **FR-003**: System MUST verify the current password matches stored credentials.
- **FR-004**: System MUST validate the new password against password security standards.
- **FR-004a**: Password policy MUST match registration policy (min 8 chars, at least one number and one symbol).
- **FR-005**: System MUST reject requests with missing required fields.
- **FR-006**: System MUST reject when current password is incorrect and show an
  explicit current-password-incorrect error.
- **FR-007**: System MUST reject when new password violates policy and show a
  policy-violation error.
- **FR-008**: System MUST reject when new password and confirmation do not match and
  show a passwords-do-not-match error.
- **FR-009**: On successful validation, system MUST update the password in the database
  and show a success confirmation.
- **FR-010**: If database update fails, system MUST show a password-change-unavailable
  error, log the failure (transient), and leave the password unchanged.
- **FR-011**: After a successful change, the user MUST remain authenticated.

### Key Entities *(include if feature involves data)*

- **User Account**: Stored credentials for the logged-in user.
- **Session State**: Tracks authentication state.
- **Password Change Error Log**: Captures update failures (transient).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of valid password change requests update the password and show
  success confirmation.
- **SC-002**: 100% of incorrect current-password submissions are rejected with the
  correct error.
- **SC-003**: 100% of non-compliant new passwords are rejected with a policy error.
- **SC-004**: 100% of mismatched confirmation submissions are rejected.
- **SC-005**: 100% of DB update failures show a password-change-unavailable error and
  are logged.
- **SC-006**: 100% of post-change logins accept the new password and reject the old one.

### Non-Functional Requirements

- **NFR-001**: Password change validation + update MUST complete within 2 seconds for
  typical users on a development laptop.
- **NFR-002**: Error messages MUST be accessible using semantic HTML and keyboard
  navigation.
