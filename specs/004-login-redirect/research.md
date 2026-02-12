# Research: Redirect to Login After Registration

## Decision 1: Confirmation delay before redirect
- **Decision**: Use a short fixed delay (1–3 seconds) before redirect initiation.
- **Rationale**: Ensures users see the confirmation without adding friction.
- **Alternatives considered**: Immediate redirect; user-triggered continue button.

## Decision 2: Redirect failure handling
- **Decision**: Keep the user on the confirmation view with an inline error and manual login link/button.
- **Rationale**: Preserves context and provides a clear recovery path.
- **Alternatives considered**: Dedicated error page; modal overlay only.

## Decision 3: Auto-authentication correction
- **Decision**: Detect unintended authenticated state and force logout before redirecting to login.
- **Rationale**: Enforces manual login policy and restores expected flow.
- **Alternatives considered**: Allow auto-login; warn only.

## Decision 4: Redirect failure logging
- **Decision**: Log failures with timestamp, destination, and user/session identifier (if available).
- **Rationale**: Matches UC-04/AT-04 expectations and supports admin review.
- **Alternatives considered**: No logging; minimal message-only logging.
