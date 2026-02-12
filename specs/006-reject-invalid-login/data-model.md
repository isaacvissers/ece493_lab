# Data Model: Reject Invalid Login Credentials

## Entities

### User Account
- **Purpose**: Stores registered user credentials and status.
- **Key attributes**: id, email, passwordHash, status (active)

### Session State
- **Purpose**: Tracks authentication state for the current session.
- **Key attributes**: isAuthenticated, userId (optional), lastAuthAt

### Login Failure Log
- **Purpose**: Records invalid-credential and lookup failures (transient; not persisted).
- **Key attributes**: timestamp, identifier, errorSummary, failureType
