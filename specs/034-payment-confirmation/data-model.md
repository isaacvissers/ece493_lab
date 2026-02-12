# Data Model: Payment Confirmation Ticket

## Entities

### TicketReceipt
- **id**
- **registrationId**
- **attendeeName**
- **ticketType**
- **amountPaid**
- **transactionReference**
- **issuedAt**
- **format**: html

### ConfirmationRecord
- **id**
- **registrationId**
- **receiptId**
- **status**: generated | pending | failed
- **createdAt**
- **updatedAt**

### DeliveryLog
- **id**
- **registrationId**
- **channel**: email | in_app
- **status**: sent | failed | retrying
- **lastAttemptAt**

## Relationships

- ConfirmationRecord **has one** TicketReceipt
- ConfirmationRecord **has many** DeliveryLog entries

## Validation Rules

- Confirmation can only be generated for paid or $0 confirmed registrations.
- Ticket receipts must include all required details.
- Duplicate confirmations for the same transaction are not allowed.

## State Transitions

- ConfirmationRecord: pending → generated
- ConfirmationRecord: pending → failed
