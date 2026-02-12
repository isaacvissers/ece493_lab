# Quickstart: Change Password

## Goal
Validate password change for authenticated users with policy enforcement and safe failure handling.

## Scenarios to Verify

1) **Happy path**
- Enter correct current password + compliant new password + matching confirmation.
- Confirm success message and password updated.

2) **Missing fields**
- Submit with any required field blank.
- Confirm required-fields error and no password change.

3) **Incorrect current password**
- Submit with wrong current password.
- Confirm current-password-incorrect error and no change.

4) **Policy violation**
- Submit a non-compliant new password.
- Confirm policy-violation error and no change.

5) **Confirmation mismatch**
- Submit mismatched confirmation.
- Confirm passwords-do-not-match error and no change.

6) **DB update failure**
- Simulate update failure.
- Confirm password-change-unavailable error and transient log entry.

7) **Session expired**
- Access change password with expired session.
- Confirm redirect to login before changing.

8) **Post-change login**
- Log out; old password fails; new password succeeds.

## Performance & Accessibility
- Password change completes within 2 seconds.
- Errors are accessible via keyboard and screen readers.
