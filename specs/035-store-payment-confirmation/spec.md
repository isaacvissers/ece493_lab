# Feature Specification: Store Payment Confirmation

**Feature Branch**: `035-store-payment-confirmation`  
**Created**: 2026-02-04  
**Status**: Draft  
**Input**: User description: "UC-35"

## Clarifications

### Session 2026-02-05

- Q: How can payment confirmations be delivered to the CMS? → A: Support both synchronous redirect confirmations and asynchronous webhooks.
- Q: What authentication method should be required for confirmations? → A: Require HMAC signature verification.
- Q: What should be the idempotency key for confirmations? → A: Use transaction_id as the unique idempotency key.
- Q: How long should stored payment confirmations be retained? → A: Retain confirmations for 90 days.
- Q: Any accessibility or localization requirements? → A: No new UI is introduced; if any UI is touched, it must meet accessibility requirements per constitution.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Store confirmation and update status (Priority: P1)

As the CMS system, I store a valid payment confirmation and update registration status so the attendee is recorded as paid/confirmed.

**Why this priority**: This is the core UC-35 outcome and ensures financial integrity and accurate registration state.

**Independent Test**: Can be tested by processing a valid confirmation and verifying stored confirmation plus status update.

**Acceptance Scenarios**:

1. **Given** a valid payment confirmation is received for an existing order, **When** validation passes, **Then** the confirmation is stored and the registration is marked Paid/Confirmed. (Trace: UC-35 Main, S-35 Main, AT-UC35-01)
2. **Given** a valid confirmation is stored, **When** the system updates the registration record, **Then** the updated status is available to downstream workflows. (Trace: UC-35 Main, S-35 Main, AT-UC35-02)

---

### User Story 2 - Reject invalid or duplicate confirmations (Priority: P2)

As the CMS system, I reject invalid or duplicate confirmations so I do not corrupt registration data.

**Why this priority**: Prevents incorrect confirmations and duplicate status updates.

**Independent Test**: Can be tested by submitting an invalid confirmation and a duplicate confirmation.

**Acceptance Scenarios**:

1. **Given** a confirmation fails validation (amount/currency/signature/source), **When** it is processed, **Then** it is rejected and no registration status is updated. (Trace: UC-35 2a, S-35 2a, AT-UC35-03)
2. **Given** a duplicate confirmation is received, **When** idempotency checks run, **Then** no duplicate records or status changes occur and a success/ack is returned. (Trace: UC-35 3a, S-35 3a, AT-UC35-04)

---

### User Story 3 - Handle storage/update failures (Priority: P3)

As the CMS system, I handle persistence or status update failures safely so data remains consistent and recoverable.

**Why this priority**: Ensures resilience to database and logging failures while preventing false confirmations.

**Independent Test**: Can be tested by simulating DB write failures and status update failures.

**Acceptance Scenarios**:

1. **Given** storing the confirmation fails, **When** the system attempts persistence, **Then** the registration is not marked confirmed and the event is queued or flagged for reconciliation. (Trace: UC-35 4a, S-35 4a, AT-UC35-05)
2. **Given** confirmation is stored but status update fails, **When** the system attempts the update, **Then** the inconsistency is logged and the status update is retried or queued. (Trace: UC-35 5a, S-35 5a, AT-UC35-06)
3. **Given** audit logging fails, **When** confirmation and status update succeed, **Then** the system records the logging failure via fallback without blocking the main flow. (Trace: UC-35 6a, S-35 6a, AT-UC35-07)

---

### Edge Cases

- Confirmation fails validation (wrong amount/currency or invalid signature).
- No matching order/registration exists.
- Duplicate confirmation received.
- Database write fails for confirmation storage.
- Status update fails after confirmation is stored.
- Audit logging fails after successful update.
- Downstream ticket/notification trigger fails.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST validate payment confirmations, including HMAC signature verification for source authenticity (HMAC-SHA256 over the raw request body using a shared secret; signature provided in `X-Signature` header), plus amount, currency, and order/payment intent match.
- **FR-002**: The system MUST perform idempotency checks using transaction_id as the unique key before processing.
- **FR-003**: The system MUST store payment confirmation details (transaction ID, amount, currency, timestamp, attendee reference, status).
- **FR-004**: The system MUST update the registration/order status to Paid/Confirmed after successful confirmation storage; Paid/Confirmed means `status = "paid_confirmed"` and `paid_at` is set to the confirmation timestamp.
- **FR-005**: The system MUST record an audit log entry for confirmation and status update.
- **FR-006**: If validation fails, the system MUST reject the confirmation and not update status.
- **FR-007**: If no matching order exists, the system MUST record the confirmation in an unmatched queue/store and log the mismatch.
- **FR-008**: If a duplicate confirmation is received, the system MUST not create duplicate records or status updates and MUST return an acknowledgement.
- **FR-009**: If confirmation storage fails, the system MUST not mark the registration as confirmed and MUST queue or flag for reconciliation.
- **FR-010**: If status update fails after storage, the system MUST enqueue a retry job and attempt up to 3 retries with exponential backoff (e.g., 1m, 5m, 15m), and log the inconsistency; retry queue entries MUST be persisted in localStorage and retrievable for reconciliation.
- **FR-011**: If audit logging fails, the system MUST record a fallback log entry in a local `audit_fallback` store and expose those entries for reconciliation without blocking confirmation storage or status update.
- **FR-012**: The system MUST expose updated registration status to downstream workflows (e.g., confirmation retrieval).
- **FR-013**: Downstream ticket/notification triggers MUST be invoked after successful confirmation but failure MUST NOT revert confirmation.
- **FR-016**: Downstream trigger invocations MUST include transaction_id, order_id (if present), attendee_ref, and resulting registration status, and any trigger failure MUST be recorded in the audit log.
- **FR-014**: The system MUST accept confirmations delivered via synchronous redirect and asynchronous webhook channels.
- **FR-015**: The system MUST reject confirmations with timestamps older than 5 minutes from receipt time to reduce replay risk.

### Downstream Trigger Interface

- **DT-001**: The downstream trigger interface MUST accept a payload containing transaction_id, order_id (nullable), attendee_ref, registration_status, and confirmation_timestamp.
- **DT-002**: Trigger invocation failures MUST be logged to the audit log with the payload identifier(s) for reconciliation.

### Key Entities *(include if feature involves data)*

- **PaymentConfirmation**: Stored confirmation details for a transaction.
- **RegistrationOrder**: Order/registration record with payment status.
- **UnmatchedPayment**: Queue/store of confirmations with no matching order.
- **AuditLogEntry**: Audit record of confirmation and status change.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 99% of valid confirmations are stored and status updated within 1 minute.
- **SC-002**: 100% of invalid confirmations are rejected without status updates.
- **SC-003**: 100% of duplicates are idempotently handled without duplicate records.
- **SC-004**: 100% of storage/status update failures are logged and queued for reconciliation.
- **SC-005**: 95% of confirmation processing completes within 200 ms (excluding downstream notification triggers).

## Assumptions

- Confirmations can arrive synchronously (redirect) or asynchronously (webhook), and both are supported.
- Required confirmation fields are transaction ID, amount, currency, timestamp, attendee reference, and status.
- Payment confirmations, audit entries, audit_fallback entries, and unmatched queues retain entries for 90 days.
- No new UI is introduced; if any UI is touched, it MUST meet accessibility requirements (semantic HTML, keyboard operability, visible focus) per constitution.
- A “valid confirmation” is one that passes HMAC verification, matches order amount/currency, and has a timestamp within the replay window.
