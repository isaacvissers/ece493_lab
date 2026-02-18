# Quickstart: Receive Review Invitation by Email

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/016-review-invitation-email/spec.md

## Run Tests

```bash
npm test && npm run lint
```

## Feature Validation Checklist

- Invitation email includes paper details and accept/reject links.
- Accept records response and marks assignment accepted.
- Reject records response and marks assignment rejected.
- Invalid/expired links show error and do not record response.
- Send/record failures are logged and leave assignment unchanged.
- Invitation links expire after 7 days.
- Reviewer response actions are keyboard accessible (Tab + Enter).
- Performance note: Invitation delivery should complete within 2 minutes in the simulated environment.
