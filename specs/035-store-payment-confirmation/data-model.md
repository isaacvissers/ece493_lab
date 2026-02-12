# Phase 1 Data Model - Store Payment Confirmation

## Entities

### PaymentConfirmation
- Fields:
  - transaction_id (string, unique, required)
  - amount (number, required)
  - currency (string, required)
  - timestamp (string/ISO-8601, required)
  - attendee_ref (string, required)
  - status (string, required; e.g., "confirmed")
  - source_channel (string, required; "redirect" | "webhook")
- Relationships:
  - Belongs to RegistrationOrder (by order/payment intent match)
- Validation rules:
  - HMAC signature verification required for authenticity.
  - amount/currency must match order/payment intent.
  - transaction_id must be idempotent (no duplicates).
- Retention:
  - 90 days.

### RegistrationOrder
- Fields (relevant to feature):
  - order_id (string, required)
  - payment_intent_id (string, optional)
  - attendee_ref (string, required)
  - status (string, required; transitions to Paid/Confirmed)
  - paid_at (string/ISO-8601, optional; set on Paid/Confirmed)
- Relationships:
  - Has many PaymentConfirmations (by order/payment intent match)
- State transitions:
  - Pending/Unpaid -> Paid/Confirmed upon successful confirmation storage.

### UnmatchedPayment
- Fields:
  - transaction_id (string, required)
  - amount (number, required)
  - currency (string, required)
  - timestamp (string/ISO-8601, required)
  - attendee_ref (string, optional)
  - reason (string, required; e.g., "no matching order")
  - source_channel (string, required)
- Relationships:
  - None (pending reconciliation)
- Retention:
  - 90 days.

### AuditLogEntry
- Fields:
  - event_type (string, required; e.g., "payment_confirmation_stored")
  - transaction_id (string, required)
  - order_id (string, optional)
  - timestamp (string/ISO-8601, required)
  - outcome (string, required; "success" | "failure")
  - details (string, optional)
- Retention:
  - 90 days.

### AuditFallbackEntry
- Fields:
  - event_type (string, required)
  - transaction_id (string, required)
  - order_id (string, optional)
  - timestamp (string/ISO-8601, required)
  - details (string, optional)
- Retention:
  - 90 days.

## Relationships
- PaymentConfirmation 1:0..* AuditLogEntry
- PaymentConfirmation 1:0..* AuditFallbackEntry
- UnmatchedPayment 1:0..* AuditLogEntry
- UnmatchedPayment 1:0..* AuditFallbackEntry

## Notes
- Payment confirmations are stored even if downstream triggers fail.
- Unmatched confirmations are queued for reconciliation; no status update occurs.
- Confirmations older than 5 minutes from receipt time are rejected to reduce replay risk.
