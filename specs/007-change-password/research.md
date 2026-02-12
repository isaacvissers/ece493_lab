# Research: Change Password

## Decision 1: Password policy
- **Decision**: Reuse registration policy (min 8 chars, number + symbol).
- **Rationale**: Consistency across registration and change flows.
- **Alternatives considered**: Separate policy for changes; no policy enforcement.

## Decision 2: Session handling after change
- **Decision**: Keep user logged in after password change.
- **Rationale**: Reduces friction and matches clarified requirement.
- **Alternatives considered**: Force re-login; prompt user.

## Decision 3: Confirmation requirement
- **Decision**: Require new password confirmation.
- **Rationale**: Prevents accidental changes and matches AT-07.
- **Alternatives considered**: No confirmation; optional confirmation.

## Decision 4: Failure logging persistence
- **Decision**: Log update failures as transient error events (no persistence).
- **Rationale**: Matches scope and avoids storage changes.
- **Alternatives considered**: Persist logs; aggregate metrics only.
