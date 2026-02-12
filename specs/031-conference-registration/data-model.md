# Data Model: Conference Registration for Authenticated Users

## Entities

### Registration
- **id**
- **userId**
- **status**: Registered | PendingPayment | Failed
- **name**
- **affiliation**
- **contactEmail**
- **attendanceType**
- **createdAt**
- **updatedAt**

### RegistrationWindow
- **startAt**
- **endAt**
- **isOpen**

### Payment
- **id**
- **registrationId**
- **amount**
- **status**: success | failure | cancelled | not_required
- **providerRef**

### Notification
- **id**
- **registrationId**
- **channel**: in_app | email
- **status**: sent | failed
- **sentAt**

### RegistrationLog
- **id**
- **registrationId**
- **event**: save_failure | notification_failure
- **timestamp**
- **message**

## Relationships

- Registration 1 : 1 UserAccount
- Registration **has one** Payment (if required)
- Registration **has many** Notification records
- RegistrationLog **records** failures for a Registration

## Validation Rules

- Registration allowed only when RegistrationWindow.isOpen is true.
- Duplicate registrations for the same user are blocked.
- Payment required unless amount == 0; only then status can become Registered.
- Registration save failures and notification failures are logged.

## State Transitions

- draft → Registered (payment success or not required)
- draft → PendingPayment (payment required but not completed)
- draft → Failed (save failure)
