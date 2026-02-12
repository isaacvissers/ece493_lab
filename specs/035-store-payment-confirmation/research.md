# Phase 0 Research - Store Payment Confirmation

## Decision: JavaScript (ES2020) + HTML5/CSS3 (vanilla)
- Rationale: Matches project-wide constraints and existing features; supports MVC in browser.
- Alternatives considered: TypeScript or framework-based UI (rejected by constitution).

## Decision: Browser localStorage + in-memory cache for persistence
- Rationale: Consistent with CMS simulation and existing feature storage approach.
- Alternatives considered: Server-side database (out of scope for this lab environment).

## Decision: Ingestion via redirect + webhook using HMAC signature verification
- Rationale: Required by spec clarifications; HMAC provides strong authenticity for both channels.
- Alternatives considered: Provider API verification call; shared secret token only.

## Decision: Idempotency key = transaction_id
- Rationale: Explicit clarification; simplest unique key to prevent duplicates.
- Alternatives considered: payment_intent_id; composite keys; provider idempotency key.

## Decision: Testing via project `npm test` + `npm run lint`
- Rationale: Standard workflow for this repository; supports unit and integration tests.
- Alternatives considered: Custom test runner (not needed).

## Decision: Performance targets per constitution
- Rationale: Must satisfy <=200 ms interactions and <=50 ms main-thread tasks.
- Alternatives considered: None (non-negotiable).

## Decision: Target platform = modern desktop browsers
- Rationale: Existing CMS runs in browser; localStorage depends on browser environment.
- Alternatives considered: Mobile or server-only execution (out of scope).
