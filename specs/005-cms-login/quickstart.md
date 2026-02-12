# Quickstart: Log in to CMS

## Goal
Validate the login flow for registered users and error handling for failures.

## Scenarios to Verify

1) **Happy path login**
- Open login form, enter valid email + password, submit.
- Confirm authentication and redirect to home page.

2) **Registration option**
- From login form, confirm a registration option is visible for new users.

3) **Missing fields**
- Submit with blank email or password.
- Confirm required-fields error and no authentication.

4) **Invalid credentials**
- Use non-existent email or wrong password.
- Confirm invalid-credentials error and no authentication.

5) **Database lookup failure**
- Simulate DB lookup failure.
- Confirm login-unavailable error and transient log entry.

6) **Session access**
- After login, access protected page and confirm session persists.
- When unauthenticated, attempt protected access and confirm redirect to login.

7) **Automated tests**
- Run `npm test` to execute unit, integration, and acceptance tests.

## Performance & Accessibility
- Login validation + redirect completes within 2 seconds.
- Errors are accessible via keyboard and screen readers.
