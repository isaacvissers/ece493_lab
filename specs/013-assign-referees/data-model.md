# Data Model: Assign Referees to Submitted Papers

## Entities

### Paper
- **Fields**:
  - id
  - title
  - status (Submitted | Ineligible)
  - assignedRefereeEmails (exactly 3 unique emails)

### RefereeAssignment
- **Fields**:
  - paperId
  - refereeEmail
  - assignedAt

### NotificationLog
- **Fields**:
  - paperId
  - refereeEmail
  - status (sent | failed)
  - errorMessage (optional)
  - attemptedAt

### User
- **Fields**:
  - id
  - role (Editor | other)

## Relationships
- Paper 1:3 RefereeAssignment
- RefereeAssignment 1:0..1 NotificationLog

## Validation Rules
- Only Editors can assign referees.
- Paper must be eligible (Submitted status).
- Exactly three referee emails must be provided.
- Each referee email must be non-blank, valid format, and unique.
- Duplicate emails are rejected/ignored; assignment blocked if resulting count != 3.

## State Transitions
- Paper (Submitted, no assignments) -> Paper (Submitted, 3 referee assignments)
- Assignment save failure -> No assignments recorded
- Notification failure -> Assignments remain; notification logged as failed
