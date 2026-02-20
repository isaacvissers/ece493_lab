# Implementation Tasks: Make Final Accept/Reject Decision

**Branch**: `024-final-decision`
**Date**: 2026-02-03
**Spec**: /home/ivissers/ece_493/labs/lab2/lab2/specs/024-final-decision/spec.md
**Plan**: /home/ivissers/ece_493/labs/lab2/lab2/specs/024-final-decision/plan.md

## Phase 1: Setup

- [ ] T001 Create feature folder structure per plan in src/ and tests/
- [ ] T002 Add seed fixtures for Paper, Review, Decision, Notification in src/services/fixtures.js
- [X] T003 Add shared constants for decision statuses and review counts in src/models/decisionConstants.js

## Phase 2: Foundational

- [ ] T004 Implement Paper model with status and editor assignment in src/models/Paper.js
- [ ] T005 Implement Review model with submitted status in src/models/Review.js
- [ ] T006 Implement Decision model with finality guard in src/models/Decision.js
- [ ] T007 Implement Notification model in src/models/Notification.js
- [ ] T008 Implement AuditLog model in src/models/AuditLog.js
- [X] T009 Implement decision eligibility service (exactly 3 reviews) in src/services/decisionEligibilityService.js
- [X] T010 Implement decision persistence service (atomic save) in src/services/decisionService.js
- [X] T011 Implement notification service for author updates in src/services/authorNotificationService.js

## Phase 3: User Story 1 - Decide on eligible papers (P1)

**Story Goal**: Editors can accept or reject papers that have exactly three completed reviews.

**Independent Test Criteria**: Eligible papers appear; accept/reject saves and updates paper status.

- [ ] T012 [P] [US1] Add unit tests for eligibility service in tests/unit/decisionEligibilityService.test.js
- [ ] T013 [P] [US1] Add unit tests for decision persistence in tests/unit/decisionService.test.js
- [X] T014 [US1] Implement decision queue view in src/views/decisionQueueView.js
- [X] T015 [US1] Implement decision entry view in src/views/decisionEntryView.js
- [X] T016 [US1] Implement decision save controller in src/controllers/decisionController.js
- [ ] T017 [US1] Add integration test for Accept decision save (AT-UC24-03) in tests/integration/decisionAcceptFlow.test.js
- [ ] T018 [US1] Add integration test for Reject decision save (AT-UC24-04) in tests/integration/decisionRejectFlow.test.js
- [ ] T034 [US1] Add integration test for decision queue eligibility list (AT-UC24-01) in tests/integration/decisionQueueEligibility.test.js
- [ ] T035 [US1] Add integration test for viewing three completed reviews (AT-UC24-02) in tests/integration/decisionReviewDisplay.test.js

## Phase 4: User Story 2 - Eligibility and input validation (P2)

**Story Goal**: Decision entry is blocked when prerequisites are not met.

**Independent Test Criteria**: Fewer/more reviews, missing decision, or unauthorized access are blocked.

- [ ] T019 [P] [US2] Add unit tests for decision selection validation in tests/unit/decisionSelectionValidation.test.js
- [ ] T020 [US2] Implement validation messaging for missing decision in src/views/decisionEntryView.js
- [ ] T021 [US2] Implement authorization checks in src/controllers/decisionAuthController.js
- [ ] T022 [US2] Add integration test for fewer-than-three reviews blocked (AT-UC24-05) in tests/integration/decisionTooFewReviews.test.js
- [ ] T023 [US2] Add integration test for more-than-three reviews blocked (AT-UC24-06) in tests/integration/decisionTooManyReviews.test.js
- [ ] T024 [US2] Add integration test for unauthorized editor (AT-UC24-07) in tests/integration/decisionUnauthorizedEditor.test.js
- [ ] T025 [US2] Add integration test for missing decision selection (AT-UC24-08) in tests/integration/decisionMissingSelection.test.js

## Phase 5: User Story 3 - Failure handling and notifications (P3)

**Story Goal**: Decision saving is resilient to failures and notifications do not roll back decisions.

**Independent Test Criteria**: DB failures leave status unchanged; notification failures logged without rollback.

- [ ] T026 [P] [US3] Add unit tests for decision atomic save rollback in tests/unit/decisionAtomicSave.test.js
- [ ] T027 [US3] Implement error handling for decision save failures in src/controllers/decisionController.js
- [ ] T028 [US3] Implement notification failure logging in src/services/authorNotificationService.js
- [ ] T029 [US3] Add integration test for DB write failure (AT-UC24-09) in tests/integration/decisionDbFailure.test.js
- [ ] T030 [US3] Add integration test for notification failure post-save (AT-UC24-10) in tests/integration/decisionNotificationFailure.test.js

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T031 Add accessibility focus handling for decision UI in src/views/decisionAccessibility.js
- [ ] T032 Add performance check for decision submission UX in tests/integration/decisionPerformanceChecklist.md
- [ ] T033 Run quickstart validation steps from specs/024-final-decision/quickstart.md
- [ ] T036 Add 200ms decision submission timing validation in tests/integration/decisionTimingChecklist.md

## Dependencies

- US1 before US2 (US2 builds on decision flow and validation context).
- US1 before US3 (US3 extends decision flow with failure handling).

## Parallel Execution Examples

- US1: T012 and T013 can run in parallel.
- US2: T019 can run in parallel with T020.
- US3: T026 can run in parallel with T027.

## Implementation Strategy

Start with eligibility and decision flow (US1), add gating/authorization (US2), then implement failure handling and notifications (US3). Finish with accessibility and performance checks.

## Traceability to Acceptance Tests

- AT-UC24-01: T014
- AT-UC24-02: T015
- AT-UC24-03: T017
- AT-UC24-04: T018
- AT-UC24-05: T022
- AT-UC24-06: T023
- AT-UC24-07: T024
- AT-UC24-08: T025
- AT-UC24-09: T029
- AT-UC24-10: T030
