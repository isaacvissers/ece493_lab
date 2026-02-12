# Quickstart: Redirect to Login After Registration

## Goal
Validate the registration success confirmation and redirect-to-login flow.

## Scenarios to Verify

1) **Happy path redirect**
- Complete a successful registration.
- Confirm a success message is visible.
- After 1–3 seconds, confirm redirect to login and login form is visible.

2) **Correct destination**
- After redirect, verify the route/page is the login page (not dashboard).

3) **No auto-authentication**
- Attempt to access a protected page after redirect without logging in.
- Confirm access is blocked and user is treated as unauthenticated.

4) **Auto-authentication recovery**
- Simulate an unintended authenticated state after registration.
- Confirm the system logs out and redirects to login.

5) **Redirect failure handling**
- Simulate redirect/navigation failure.
- Confirm an error message appears on the confirmation view and a manual login link/button is visible.

6) **Redirect failure logging**
- Simulate redirect failure.
- Confirm a log entry exists with timestamp, destination, and session/user identifier if available.

7) **Login form unavailable**
- Simulate login form unavailable state.
- Confirm error message is shown on confirmation view with manual login link/button and user remains unauthenticated.

8) **Automated tests**
- Open `tests/run.html` to execute unit, integration, and acceptance tests in-browser.

## Performance & Accessibility
- Confirmation + redirect initiation completes within 3 seconds.
- Error messages and manual navigation are accessible via keyboard and screen readers.
