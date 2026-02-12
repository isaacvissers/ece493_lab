# Research: Log in to CMS

## Decision 1: Login identifier
- **Decision**: Use email as the login identifier (may be labeled “Email” or “Username/Email”).
- **Rationale**: Aligns with registration flow and AT-05 assumptions.
- **Alternatives considered**: Distinct username; allow either username or email.

## Decision 2: Retry limits / lockout
- **Decision**: No retry limit or lockout for this feature.
- **Rationale**: Open issues in UC-05; keep scope minimal.
- **Alternatives considered**: Temporary lockout after N attempts; warning-only threshold.

## Decision 3: Login failure logging
- **Decision**: Log database lookup failures as transient events (no persistence).
- **Rationale**: Matches scope and avoids storage additions.
- **Alternatives considered**: Persist logs; aggregate metrics only.
