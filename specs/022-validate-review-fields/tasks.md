# Implementation Tasks: Validate Review Form Fields

**Branch**: `022-validate-review-fields`  
**Date**: 2026-02-03  
**Spec**: /home/ivissers/ece_493/labs/lab2/lab2/specs/022-validate-review-fields/spec.md  
**Plan**: /home/ivissers/ece_493/labs/lab2/lab2/specs/022-validate-review-fields/plan.md

## Phase 1: Setup

- [ ] T001 Create feature folder structure per plan in src/ and tests/
- [ ] T002 Add seed fixtures for ReviewForm, ValidationRuleSet, ReviewDraft in src/services/fixtures.js
- [ ] T003 Add shared constants for validation types and field keys in src/models/validationConstants.js

## Phase 2: Foundational

- [ ] T004 Implement ReviewForm model with required fields and length rules in src/models/ReviewForm.js
- [ ] T005 Implement ValidationRuleSet model and loader in src/models/ValidationRuleSet.js
- [ ] T006 Implement ReviewDraft model with validationErrors in src/models/ReviewDraft.js
- [ ] T007 Implement validation error model helper in src/models/ValidationError.js
- [ ] T008 Implement review validation service (required, invalid chars, max length) in src/services/reviewValidationService.js
- [ ] T009 Implement rules availability guard and logging in src/services/validationRulesService.js

## Phase 3: User Story 1 - Validate on save/submit (P1)

**Story Goal**: Validate review inputs on save/submit and block invalid entries.

**Independent Test Criteria**: Valid inputs save/submit successfully; blanks/invalid chars are blocked with errors.

- [ ] T010 [P] [US1] Add unit tests for required-field and invalid-character rules in tests/unit/reviewValidationRules.test.js
- [ ] T011 [P] [US1] Add unit tests for save vs submit validation differences in tests/unit/reviewValidationContext.test.js
- [ ] T012 [US1] Implement validation flow in review save/submit controller in src/controllers/reviewValidationController.js
- [ ] T013 [US1] Render field-level validation errors in src/views/reviewValidationView.js
- [ ] T014 [US1] Add integration test for valid save/submit success in tests/integration/reviewValidationHappyPath.test.js
- [ ] T015 [US1] Add integration test for blank required field blocking submission in tests/integration/reviewBlankRequiredFlow.test.js
- [ ] T016 [US1] Add integration test for invalid character blocking in tests/integration/reviewInvalidCharsFlow.test.js

## Phase 4: User Story 2 - Show consolidated validation feedback (P2)

**Story Goal**: Provide consolidated error summaries and highlight all invalid fields.

**Independent Test Criteria**: Multiple errors show a consolidated summary with per-field messages.

- [ ] T017 [P] [US2] Add unit tests for consolidated error summary composition in tests/unit/reviewErrorSummary.test.js
- [ ] T018 [US2] Implement consolidated error summary component in src/views/reviewErrorSummaryView.js
- [ ] T019 [US2] Update validation view to list each field with its error message in src/views/reviewValidationView.js
- [ ] T020 [US2] Add integration test for multi-error summary in tests/integration/reviewMultiErrorFlow.test.js
- [ ] T021 [US2] Add integration test for max-length violation messaging in tests/integration/reviewMaxLengthFlow.test.js

## Phase 5: User Story 3 - Fail safely on validation or storage issues (P3)

**Story Goal**: Block actions when rules are unavailable or storage fails after validation.

**Independent Test Criteria**: Rules-unavailable and storage-failure scenarios block action, show error, and log.

- [ ] T022 [P] [US3] Add unit tests for rules-unavailable guard in tests/unit/validationRulesGuard.test.js
- [ ] T023 [P] [US3] Add unit tests for storage failure handling in tests/unit/reviewStorageFailure.test.js
- [ ] T024 [US3] Implement rules-unavailable error handling in src/controllers/reviewValidationController.js
- [ ] T025 [US3] Implement storage failure error handling in src/services/reviewStorageService.js
- [ ] T026 [US3] Add integration test for rules-unavailable failure in tests/integration/reviewRulesUnavailableFlow.test.js
- [ ] T027 [US3] Add integration test for storage failure after validation in tests/integration/reviewStorageFailureFlow.test.js

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T028 Add accessibility focus management for validation errors in src/views/reviewValidationAccessibility.js
- [ ] T029 Add performance guard for validation feedback timing in src/controllers/reviewValidationController.js
- [ ] T030 Add integration test for accessibility focus behavior in tests/integration/reviewValidationAccessibilityFlow.test.js
- [ ] T031 Add performance validation checklist for 200ms target in tests/integration/reviewValidationPerformanceChecklist.md

## Dependencies

- US1 before US2 (US2 builds on validation outputs).
- US1 before US3 (US3 extends validation flow with fail-safe handling).

## Parallel Execution Examples

- US1: T010 and T011 can run in parallel.
- US2: T017 can run in parallel with T018.
- US3: T022 and T023 can run in parallel.

## Implementation Strategy

Start with base validation rules (US1), add consolidated feedback (US2), then
implement fail-safe handling (US3). Finish with accessibility and performance
cross-cutting tasks.

## Traceability to Acceptance Tests

- AT-UC22-01: T014
- AT-UC22-02: T015
- AT-UC22-03: T016
- AT-UC22-04: T020
- AT-UC22-05: T021
- AT-UC22-06: T027
- AT-UC22-07: T026
