# Research: Credit Card Payment

## Decision 1: Payment gateway simulation
- **Decision**: Use a simulated gateway service backed by localStorage/in-memory to model authorization, capture, declines, and timeouts.
- **Rationale**: The lab environment requires no external dependencies while still exercising failure paths and retries.
- **Alternatives considered**: Integrating a real processor sandbox (rejected due to external dependency and environment constraints).

## Decision 2: Authorization and capture behavior
- **Decision**: Authorize then capture on success; record both states in the Payment model.
- **Rationale**: Aligns with UC-33 flow and reduces duplicate charge risk.
- **Alternatives considered**: Immediate capture only; deferred capture after manual review.

## Decision 3: Idempotency and retry handling
- **Decision**: Treat each payment submission as a single attempt with an idempotency key to prevent double charges; allow retry only after failed attempts.
- **Rationale**: Matches UC-33 retry flow and prevents duplicate charges on network retries.
- **Alternatives considered**: Allow multiple simultaneous attempts; reject all retries (both increase user friction or risk duplicate charges).

## Decision 4: $0 ticket handling
- **Decision**: Bypass payment and mark registration confirmed when total due is $0.
- **Rationale**: Explicit UC-33 extension with expected attendee experience.
- **Alternatives considered**: Require a $0 “payment” attempt (adds unnecessary steps).

## Decision 5: Failure messaging
- **Decision**: Generic failure message with retry guidance; specific failure reasons are not shown to end users.
- **Rationale**: Reduces leakage of payment details while still guiding recovery.
- **Alternatives considered**: Detailed processor error codes; categorized reasons (both increase risk of sensitive detail exposure).
