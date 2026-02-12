# Quickstart: Auto-Login After Registration

## Goal
Validate the registration success confirmation and auto-login-to-dashboard flow.

## Scenarios to Verify

1) **Happy path auto-login**
- Complete a successful registration.
- Confirm a success message is visible.
- After 1–3 seconds, confirm navigation to the dashboard.

2) **Authenticated access**
- After auto-login, verify protected content is accessible.

3) **No login page detour**
- Complete a successful registration.
- Confirm the login page is not shown as part of the flow.

4) **Confirmation timing**
- Confirm the success message is visible before or during dashboard navigation.

5) **Automated tests**
- Run `npm test` to execute unit, integration, and acceptance tests.

## Performance & Accessibility
- Confirmation + navigation initiation completes within 3 seconds.
- Confirmation messages are accessible via keyboard and screen readers.
