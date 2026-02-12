# Research: Reject Invalid Login Credentials

## Decision 1: Invalid-credential messaging
- **Decision**: Use a single generic invalid-credentials message for all invalid cases.
- **Rationale**: Prevents account enumeration and aligns with UC-06/AT-06.
- **Alternatives considered**: Different messages per failure type.

## Decision 2: Failure logging persistence
- **Decision**: Log failures as transient events (no persistence).
- **Rationale**: Matches scope and avoids adding storage.
- **Alternatives considered**: Persist logs or aggregate-only metrics.

## Decision 3: Retry limits
- **Decision**: No lockout or retry limits for this feature.
- **Rationale**: Not specified in UC-06; keep minimal scope.
- **Alternatives considered**: Temporary lockout after N attempts.
