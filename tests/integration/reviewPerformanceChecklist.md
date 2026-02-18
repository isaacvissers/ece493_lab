# Review Submission Performance Checklist (200ms Target)

- [ ] Review submission handler completes within 200ms for typical payloads.
- [ ] No single main-thread task exceeds 50ms during submit flow.
- [ ] Validation error rendering remains responsive on repeated submissions.
- [ ] Notification warning display does not block UI updates.
- [ ] Draft preservation completes within 200ms on failure.
