# Data Model: Change Password

## Entities

### User Account
- **Purpose**: Stores current user credentials.
- **Key attributes**: id, email, passwordHash, status (active)

### Session State
- **Purpose**: Tracks authentication state for the current session.
- **Key attributes**: isAuthenticated, userId (optional), lastAuthAt

### Password Change Error Log
- **Purpose**: Records password change failures (transient; not persisted).
- **Key attributes**: timestamp, userId (optional), errorSummary
