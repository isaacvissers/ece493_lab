# Data Model: Log in to CMS

## Entities

### User Account
- **Purpose**: Stores registered user credentials and status.
- **Key attributes**: id, email, passwordHash, status (active)

### Session State
- **Purpose**: Tracks authentication state for the current session.
- **Key attributes**: isAuthenticated, userId (optional), lastAuthAt

### Login Failure Log
- **Purpose**: Records database lookup failures for admin review (transient; not persisted).
- **Key attributes**: timestamp, identifier, errorSummary
