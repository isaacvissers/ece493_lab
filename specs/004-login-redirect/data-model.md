# Data Model: Redirect to Login After Registration

This feature does not introduce new persistent entities beyond existing CMS data.
It relies on current account/session state and a lightweight redirect failure log.

## Entities

### User Account
- **Purpose**: Represents the newly created user from registration.
- **Key attributes**: id, email, status (active)

### Session State
- **Purpose**: Tracks whether the user is authenticated.
- **Key attributes**: isAuthenticated, userId (optional)

### Redirect Failure Log
- **Purpose**: Records redirect failures for administrator review (transient; not persisted).
- **Key attributes**: timestamp, destination, sessionId/userId (optional), errorSummary
