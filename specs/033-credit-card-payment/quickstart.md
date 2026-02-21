# Quickstart: Credit Card Payment

## Prerequisites

- Node/npm installed

## Run Tests

```bash
npm test
```

## Manual Validation Checklist

1. Log in as an attendee with an unpaid registration balance.
2. Navigate to checkout and select a ticket; confirm total amount due is shown.
3. Choose Pay via Credit Card and verify the payment form fields appear.
4. Submit a valid card and confirm receipt/confirmation is shown and status becomes paid.
5. Submit an invalid/expired card and verify a generic failure message with retry guidance.
6. Simulate gateway timeout/error and verify no confirmation is recorded.
7. Simulate persistence failure after approval and verify a pending/failed confirmation message.
8. If 3-D Secure is required, complete authentication and verify payment continues; cancel to verify failure.
9. Verify $0 total bypasses payment and confirms registration.
10. Verify payment status page shows amount and date after success.
11. If confirmation display fails, verify the receipt is available via the payment status view.
