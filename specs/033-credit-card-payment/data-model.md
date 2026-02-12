# Data Model: Credit Card Payment

## Entities

### Payment
- **id**
- **registrationId**
- **amount**
- **currency**
- **status**: authorized | captured | declined | failed | pending_confirmation
- **idempotencyKey**
- **attemptedAt**
- **capturedAt** (nullable)
- **reference**

### RegistrationBalance
- **registrationId**
- **amountDue**
- **amountPaid**
- **status**: unpaid | paid | confirmed

### PaymentReceipt
- **paymentId**
- **registrationId**
- **amount**
- **paidAt**
- **reference**

### PaymentGatewayResponse
- **paymentId**
- **result**: approved | declined | error | timeout | requires_authentication
- **reason** (nullable)
- **receivedAt**

## Relationships

- RegistrationBalance **has many** Payment
- Payment **has one** PaymentReceipt
- Payment **has one** PaymentGatewayResponse

## Validation Rules

- Required card fields must be present before submission.
- Only authenticated attendees may submit payment.
- Duplicate attempts with the same idempotencyKey are rejected.
- Authorization must precede capture.
- $0 total bypasses payment and marks registration confirmed.

## State Transitions

- Payment: authorized → captured
- Payment: authorized → failed
- Payment: declined | failed (terminal)
- RegistrationBalance: unpaid → paid → confirmed
