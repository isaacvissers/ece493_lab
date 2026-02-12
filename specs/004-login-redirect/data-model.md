# Data Model: Auto-Login After Registration

This feature does not introduce new persistent entities beyond existing CMS data.
It relies on current account/session state to authenticate the user after registration.

## Entities

### User Account
- **Purpose**: Represents the newly created user from registration.
- **Key attributes**: id, email, status (active)

### Session State
- **Purpose**: Tracks whether the user is authenticated after registration.
- **Key attributes**: isAuthenticated, userId (optional)
