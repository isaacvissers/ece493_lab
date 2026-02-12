# Quickstart: Reject Invalid Login Credentials

## Goal
Validate that invalid credentials are rejected with a generic error, no authentication
is created, and failures are logged transiently.

## Scenarios to Verify

1) **Invalid password**
- Enter valid email + wrong password.
- Confirm rejection, generic error, and no authentication.

2) **Non-existent email**
- Enter missing email + any password.
- Confirm rejection and same generic error message.

3) **Anti-enumeration**
- Compare error message for missing email vs wrong password.
- Confirm identical generic message.

4) **No session on failure**
- After invalid login, try to access protected page.
- Confirm access blocked and user remains unauthenticated.

5) **Database lookup failure**
- Simulate DB outage.
- Confirm login-unavailable error and transient log entry.

6) **Sensitive error replacement**
- If any specific error appears, confirm it is replaced by the generic message and logged.

## Performance & Accessibility
- Invalid-credential rejection completes within 2 seconds.
- Error messages are accessible via keyboard and screen readers.
