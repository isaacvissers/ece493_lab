# Feature Specification: Payment Confirmation Ticket

**Feature Branch**: `034-payment-confirmation`  
**Created**: 2026-02-04  
**Status**: Draft  
**Input**: User description: "UC-34"

## Clarifications

### Session 2026-02-04

- Q: What confirmation format should be delivered? → A: HTML confirmation page only.
- Q: Is authentication required to retrieve the ticket/receipt? → A: Authentication required.
- Q: Which confirmation delivery channels are required? → A: Email and in-app notification.
- Q: Where is authentication enforced for confirmation access? → A: Required for both the confirmation page and My Registration/Tickets view.
- Q: What is the pending-confirmation recovery behavior? → A: Retry confirmation generation on the next attendee access and log each retry.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Receive payment confirmation (Priority: P1)

As an attendee, I receive a payment confirmation ticket/receipt after successful payment so I have proof of registration.

**Why this priority**: This is the core UC-34 outcome and provides proof of purchase immediately after payment.

**Independent Test**: Can be tested by completing a successful payment and seeing a confirmation with key details.

**Acceptance Scenarios**:

1. **Given** an attendee completes a successful payment, **When** the system records the payment, **Then** a confirmation ticket/receipt is generated with conference name, attendee name, ticket type, amount paid, transaction reference, and date/time. (Trace: UC-34 Main, S-34 Main, AT-UC34-01)
2. **Given** a confirmation ticket/receipt is generated, **When** the attendee views the confirmation page, **Then** a summary is shown on the HTML confirmation page without download/print options. (Trace: UC-34 Main, S-34 Main, AT-UC34-02)

---

### User Story 2 - Handle confirmation failures (Priority: P2)

As an attendee, I receive clear feedback if confirmation generation, storage, or delivery fails so I know my payment status and can try again later.

**Why this priority**: Prevents confusion when confirmation cannot be generated or delivered after payment.

**Independent Test**: Can be tested by simulating generation/storage/notification failures and verifying messaging and recovery paths.

**Acceptance Scenarios**:

1. **Given** ticket/receipt generation fails, **When** payment has been recorded, **Then** the attendee is told confirmation is pending and the system retries or logs for reconciliation. (Trace: UC-34 3a, S-34 3a, AT-UC34-03)
2. **Given** storage fails after payment confirmation, **When** the attendee completes payment, **Then** the system shows an error indicating the ticket could not be saved while keeping payment recorded. (Trace: UC-34 5a, S-34 5a, AT-UC34-04)
3. **Given** notification delivery fails, **When** the system attempts to send confirmation, **Then** the ticket remains available in the attendee account and the failure is logged for retry. (Trace: UC-34 6a, S-34 6a, AT-UC34-05)

---

### User Story 3 - Retrieve confirmation later (Priority: P3)

As an attendee, I can retrieve my confirmation ticket/receipt later so I can show proof of registration.

**Why this priority**: Ensures confirmations remain accessible beyond the initial checkout flow.

**Independent Test**: Can be tested by completing payment and accessing the confirmation from a “My Registration/Tickets” area later.

**Acceptance Scenarios**:

1. **Given** an attendee has a confirmed registration, **When** they access My Registration/Tickets, **Then** the ticket/receipt is available. (Trace: UC-34 Main, S-34 Main, AT-UC34-06)
2. **Given** a confirmation request is repeated, **When** the attendee refreshes or retries, **Then** the existing ticket is shown and no duplicate is created. (Trace: UC-34 7b, S-34 7b, AT-UC34-07)

---

### Edge Cases

- Payment not completed; no ticket is generated.
- Ticket/receipt generation fails after payment is recorded.
- Storage failure prevents saving the ticket.
- Notification delivery fails.
- Unauthenticated access to ticket retrieval.
- Duplicate confirmation requests.
- $0 registration confirmation path.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST generate a confirmation ticket/receipt after successful payment recording.
- **FR-002**: The confirmation ticket/receipt MUST include conference name, attendee name, ticket type, amount paid, transaction reference, and date/time.
- **FR-003**: The system MUST display a confirmation summary on the HTML confirmation page and does not provide download/print options.
- **FR-004**: The system MUST store the ticket/receipt and link it to the attendee account.
- **FR-005**: The system MUST send confirmation notifications via email and in-app after successful payment.
- **FR-006**: The system MUST allow the attendee to retrieve the ticket/receipt later from My Registration/Tickets.
- **FR-007**: The system MUST avoid creating duplicate tickets for the same transaction.
- **FR-008**: If payment is not completed, the system MUST NOT generate a ticket/receipt.
- **FR-009**: If ticket generation fails, the system MUST inform the attendee that confirmation is pending and record the failure for retry/reconciliation.
- **FR-009a**: The pending confirmation message MUST state that payment is recorded and confirmation will be available on the next visit.
- **FR-010**: If ticket storage fails after payment confirmation, the system MUST show an error and keep the payment recorded.
- **FR-011**: If notification delivery fails, the system MUST keep the ticket available in the attendee account and log the failure.
- **FR-012**: If access is attempted without authentication, the system MUST prompt login before showing the ticket/receipt.
- **FR-012a**: Authentication MUST be enforced for both the confirmation page and My Registration/Tickets view.
- **FR-013**: For confirmed $0 registrations, the system MUST generate and store a confirmation ticket/receipt.
- **FR-014**: Pending confirmation retries MUST occur when the attendee next accesses confirmation or My Registration/Tickets, and each retry MUST be logged.

### Key Entities *(include if feature involves data)*

- **TicketReceipt**: The confirmation artifact with required details.
- **ConfirmationRecord**: Stored linkage between attendee account and ticket/receipt.
- **DeliveryLog**: Notification delivery outcome and retry status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of successful payments result in a confirmation ticket/receipt within 1 minute of payment being recorded.
- **SC-002**: 100% of confirmations include all required details.
- **SC-003**: 95% of attendees can retrieve their ticket/receipt within 2 minutes of opening My Registration/Tickets.
- **SC-004**: Confirmation delivery failures are logged for 100% of failed attempts.

## Assumptions

- Confirmation is delivered as an on-screen HTML summary only.
- QR codes or check-in scanning are not required for UC-34.
- Confirmations are sent only to the payer/primary attendee account.
- Email and in-app notification services are available for confirmation delivery.

## Non-Functional Requirements

- **NFR-001**: Confirmation retrieval views MUST respond within 2 seconds for 95% of requests.
- **NFR-002**: Confirmation details MUST only be visible to authenticated attendees tied to the registration.
