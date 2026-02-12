# Quickstart: View Accepted Assigned Paper in Reviewer Account

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/018-view-assigned-paper/spec.md

## Run Tests

```bash
npm test && npm run lint
```

## Feature Validation Checklist

- Accepted assignments appear in the reviewer list after refresh.
- Opening an accepted paper shows details and manuscript access.
- Unaccepted access attempts are blocked with a clear message.
- Unauthenticated reviewers are prompted to log in and returned to the list.
- Retrieval failures are logged and display an error.
- Unavailable manuscripts block access and show an unavailable message.
