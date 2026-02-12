# Quickstart: Payment Confirmation Ticket

## Prerequisites

- Node/npm installed

## Run Tests

```bash
npm test
```

## Manual Validation Checklist

1. Complete a successful payment and confirm HTML confirmation summary shows required details.
2. Verify confirmation is stored and available in My Registration/Tickets.
3. Simulate generation failure and confirm pending message + logged retry.
4. Simulate storage failure and confirm error while payment remains recorded.
5. Simulate notification delivery failure and confirm ticket remains accessible.
6. Attempt retrieval without authentication and confirm login prompt.
7. Retry confirmation retrieval and confirm no duplicate ticket created.
