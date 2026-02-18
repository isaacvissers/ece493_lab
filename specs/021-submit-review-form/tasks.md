# Implementation Tasks: Submit Completed Review Form

**Branch**: `021-submit-review-form`  
**Date**: 2026-02-03  
**Spec**: /home/ivissers/ece_493/labs/lab2/lab2/specs/021-submit-review-form/spec.md  
**Plan**: /home/ivissers/ece_493/labs/lab2/lab2/specs/021-submit-review-form/plan.md

## Phase 1: Setup

- [X] T001 Create feature folder structure per plan in src/ and tests/
- [X] T002 Add seed fixtures for ReviewForm, ReviewDraft, ReviewerAssignment, SubmittedReview in src/services/fixtures.js
- [X] T003 Add shared constants for review statuses, validation rules, and field keys in src/models/reviewConstants.js

## Phase 2: Foundational

- [X] T004 Implement ReviewForm model with requiredFields and status in src/models/ReviewForm.js
- [X] T005 Implement ReviewerAssignment model with assignment status checks in src/models/ReviewerAssignment.js
- [X] T006 Implement ReviewDraft model with validationErrors and persistence hooks in src/models/ReviewDraft.js
- [X] T007 Implement SubmittedReview model with finality guard in src/models/SubmittedReview.js
- [X] T008 Implement NotificationLog model for editor notification outcomes in src/models/NotificationLog.js
- [X] T009 Implement review submission validation service (required fields, ranges) in src/services/reviewValidationService.js
- [X] T010 Implement review submission service (save, finalize, notify) in src/services/reviewSubmissionService.js

## Phase 3: User Story 1 - Submit completed review (P1)

**Story Goal**: Allow reviewers to submit completed reviews and finalize submissions.

**Independent Test Criteria**: Valid submissions are stored as submitted and duplicates are blocked with a finality message.

- [X] T011 [P] [US1] Add unit tests for ReviewForm/SubmittedReview finality rules in tests/unit/reviewSubmissionModels.test.js
- [X] T012 [P] [US1] Add unit tests for reviewSubmissionService success path in tests/unit/reviewSubmissionService.test.js
- [X] T013 [US1] Implement submit review controller flow in src/controllers/reviewSubmissionController.js
- [X] T014 [US1] Add submit confirmation view and finality messaging in src/views/reviewSubmissionView.js
- [X] T015 [US1] Wire submit button and confirmation checkbox in src/views/reviewFormView.js
- [X] T016 [US1] Add integration test for successful submit + duplicate block in tests/integration/reviewSubmissionFlow.test.js

## Phase 4: User Story 2 - Validate review input before submission (P2)

**Story Goal**: Provide clear validation feedback before submission.

**Independent Test Criteria**: Missing/invalid fields block submission with field-level errors and summary.

- [X] T017 [P] [US2] Add unit tests for reviewValidationService rules in tests/unit/reviewValidationService.test.js
- [X] T018 [US2] Implement field-level error rendering in src/views/reviewFormValidationView.js
- [X] T019 [US2] Implement error summary component in src/views/reviewFormErrorSummaryView.js
- [X] T020 [US2] Update controller to surface validation errors before submit in src/controllers/reviewSubmissionController.js
- [X] T021 [US2] Add integration test for invalid field submission blocking in tests/integration/reviewValidationFlow.test.js

## Phase 5: User Story 3 - Handle submission failures and closed periods (P3)

**Story Goal**: Handle closed periods, unauthorized attempts, and failures without data loss.

**Independent Test Criteria**: Closed period blocks submission with view-only access; failures preserve draft; unauthorized attempts show guidance.

- [X] T022 [P] [US3] Add unit tests for closed-period and authorization checks in tests/unit/reviewSubmissionGuards.test.js
- [X] T023 [P] [US3] Add unit tests for failure logging and draft preservation in tests/unit/reviewSubmissionFailures.test.js
- [X] T024 [US3] Implement closed-period view-only state in src/views/reviewFormView.js
- [X] T025 [US3] Implement unauthorized submission messaging in src/views/reviewSubmissionView.js
- [X] T026 [US3] Implement session-expired handling in src/controllers/reviewSubmissionController.js
- [X] T027 [US3] Implement failure logging + draft preservation in src/services/reviewSubmissionService.js
- [X] T028 [US3] Add integration test for closed period and unauthorized submit in tests/integration/reviewClosedUnauthorizedFlow.test.js
- [X] T029 [US3] Add integration test for submission failure preserves draft in tests/integration/reviewSubmissionFailureFlow.test.js

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T030 Add notification failure warning banner in src/views/reviewSubmissionView.js
- [X] T031 Add accessibility checks for error focus/keyboard in src/views/reviewFormAccessibility.js
- [X] T032 Add performance guard (non-blocking UI feedback) in src/controllers/reviewSubmissionController.js
- [X] T033 Add integration test for notification failure warning in tests/integration/reviewNotificationFailureFlow.test.js
- [X] T034 Add integration test for accessibility focus on errors in tests/integration/reviewAccessibilityFlow.test.js
- [X] T035 Add review status retrieval service in src/services/reviewStatusService.js
- [X] T036 Add status controller wiring for status view in src/controllers/reviewStatusController.js
- [X] T037 Add integration test for review status retrieval in tests/integration/reviewStatusFlow.test.js
- [X] T038 Add performance validation checklist for 200ms target in tests/integration/reviewPerformanceChecklist.md

## Dependencies

- US1 before US2 (US2 builds on submit flow validation).
- US1 before US3 (US3 extends submission service and views).

## Parallel Execution Examples

- US1: T011 and T012 can run in parallel.
- US2: T017 can run in parallel with T018/T019.
- US3: T022 and T023 can run in parallel.

## Implementation Strategy

Start with the core submission flow (US1), add validation feedback (US2), then cover
closed-period and failure handling (US3). Finish with notification, accessibility,
and performance cross-cutting tasks.

## Traceability to Acceptance Tests

- AT-UC21-01: T013, T016
- AT-UC21-02: T014, T016
- AT-UC21-03: T017, T018, T019, T021
- AT-UC21-04: T022, T024, T028
- AT-UC21-05: T023, T027, T029
- AT-UC21-06: T025, T028
- AT-UC21-07: T026, T029
- AT-UC21-08: T030, T033
