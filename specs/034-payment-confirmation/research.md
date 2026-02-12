# Research: Payment Confirmation Ticket

## Decision 1: Confirmation format
- **Decision**: HTML confirmation page only (no PDF/download option).
- **Rationale**: Aligns with clarification and simplifies generation and storage.
- **Alternatives considered**: HTML + PDF; email-only.

## Decision 2: Notification channels
- **Decision**: Send confirmation via both email and in-app notification.
- **Rationale**: Improves delivery reliability and aligns with UC-34 clarifications.
- **Alternatives considered**: Email only; in-app only.

## Decision 3: Retrieval access control
- **Decision**: Require authentication for ticket/receipt retrieval.
- **Rationale**: Protects confirmation data and aligns with UC-34 extension 7a.
- **Alternatives considered**: Public link access; time-limited shared link.
