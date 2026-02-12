# Implementation Tasks: Send Completed Reviews to the Editor

**Branch**: `023-send-editor-reviews`
**Date**: 2026-02-03
**Spec**: /home/ivissers/ece_493/labs/lab2/lab2/specs/023-send-editor-reviews/spec.md
**Plan**: /home/ivissers/ece_493/labs/lab2/lab2/specs/023-send-editor-reviews/plan.md

## Phase 1: Setup

- [ ] T001 Create feature folder structure per plan in src/ and tests/
- [ ] T002 Add seed fixtures for Review, Paper, Editor, Notification in src/services/fixtures.js
- [ ] T003 Add shared constants for delivery/notification statuses in src/models/deliveryConstants.js

## Phase 2: Foundational

- [ ] T004 Implement Review model with submitted state in src/models/Review.js
- [ ] T005 Implement Paper model with editor assignment in src/models/Paper.js
- [ ] T006 Implement Editor model with permissions in src/models/Editor.js
- [ ] T007 Implement DeliveryEvent model in src/models/DeliveryEvent.js
- [ ] T008 Implement Notification model with channels in src/models/Notification.js
- [ ] T009 Implement AuditLog model in src/models/AuditLog.js
- [ ] T010 Implement delivery service with idempotency checks in src/services/reviewDeliveryService.js
- [ ] T011 Implement notification service with dual-channel send in src/services/notificationService.js
- [ ] T012 Implement audit logging service in src/services/auditLogService.js
- [ ] T013 Implement admin flag queue service for missing editor mapping in src/services/adminFlagService.js

## Phase 3: User Story 1 - In-app delivery on submission (P1)

**Story Goal**: Submitted reviews appear in the assigned editor’s in-app review list.

**Independent Test Criteria**: Successful submissions show in editor list; failed submissions do not trigger delivery.

- [ ] T014 [P] [US1] Add unit tests for delivery idempotency in tests/unit/reviewDeliveryService.test.js
- [ ] T015 [P] [US1] Add unit tests for submit gating (no delivery on failed submit) in tests/unit/reviewSubmitGate.test.js
- [ ] T016 [US1] Implement submission hook to trigger delivery in src/controllers/reviewSubmitController.js
- [ ] T017 [US1] Implement editor review list update in src/views/editorReviewListView.js
- [ ] T018 [US1] Add integration test for editor visibility after submission (AT-UC23-01) in tests/integration/editorReviewVisibility.test.js
- [ ] T019 [US1] Add integration test for no delivery on failed submission (AT-UC23-04) in tests/integration/noDeliveryOnSubmitFail.test.js

## Phase 4: User Story 2 - Notifications when enabled (P2)

**Story Goal**: Editors receive email + in-app notifications when enabled.

**Independent Test Criteria**: Notifications generated for both channels; failures do not block in-app visibility.

- [ ] T020 [P] [US2] Add unit tests for dual-channel notifications in tests/unit/notificationChannels.test.js
- [ ] T021 [US2] Implement notification trigger on submission in src/controllers/reviewNotificationController.js
- [ ] T022 [US2] Implement in-app notification view updates in src/views/editorNotificationsView.js
- [ ] T023 [US2] Add integration test for notification generation (AT-UC23-02) in tests/integration/notificationHappyPath.test.js
- [ ] T024 [US2] Add integration test for notification failure without blocking access (AT-UC23-03) in tests/integration/notificationFailureFlow.test.js

## Phase 5: User Story 3 - Exception handling and batching (P3)

**Story Goal**: Delivery exceptions are safely handled with logging, flags, and batching rules.

**Independent Test Criteria**: Missing editor, auth errors, duplicates, batching, and audit failures are handled per spec.

- [ ] T025 [P] [US3] Add unit tests for missing editor flagging in tests/unit/missingEditorFlag.test.js
- [ ] T026 [P] [US3] Add unit tests for notification retry schedule in tests/unit/notificationRetryPolicy.test.js
- [ ] T027 [P] [US3] Add unit tests for batching window rules in tests/unit/notificationBatching.test.js
- [ ] T028 [US3] Implement admin flag queue UI in src/views/adminFlagQueueView.js
- [ ] T029 [US3] Implement permission checks for editor review access in src/controllers/editorReviewAccessController.js
- [ ] T030 [US3] Implement notification retry logic in src/services/notificationService.js
- [ ] T031 [US3] Add integration test for missing editor mapping (AT-UC23-05) in tests/integration/missingEditorMapping.test.js
- [ ] T032 [US3] Add integration test for permission misconfiguration (AT-UC23-06) in tests/integration/editorPermissionMisconfig.test.js
- [ ] T033 [US3] Add integration test for duplicate delivery suppression (AT-UC23-07) in tests/integration/duplicateDeliverySuppression.test.js
- [ ] T034 [US3] Add integration test for batch submissions (AT-UC23-08) in tests/integration/batchSubmissionFlow.test.js
- [ ] T035 [US3] Add integration test for audit/log failure handling (AT-UC23-09) in tests/integration/auditLogFailureFlow.test.js
- [ ] T039 [US3] Implement admin manual resend action in src/controllers/adminNotificationResendController.js
- [ ] T040 [US3] Implement resend UI control in src/views/adminFlagQueueView.js
- [ ] T041 [US3] Add notification grouping configuration toggle in src/services/notificationConfigService.js

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T036 Add accessibility focus handling for editor review list and notifications in src/views/editorAccessibility.js
- [ ] T037 Add performance check for delivery/notification UI updates in tests/integration/deliveryPerformanceChecklist.md
- [ ] T038 Run quickstart validation steps from specs/023-send-editor-reviews/quickstart.md
- [ ] T042 Add timing validation checklist for SC-001/SC-003 in tests/integration/deliveryTimingChecklist.md

## Dependencies

- US1 before US2 (notifications depend on delivery triggers).
- US1 before US3 (exception handling extends delivery flow).

## Parallel Execution Examples

- US1: T014 and T015 can run in parallel.
- US2: T020 can run in parallel with T021.
- US3: T025, T026, and T027 can run in parallel.

## Implementation Strategy

Start with delivery flow (US1), add notifications (US2), then implement exception handling and batching (US3). Finish with accessibility and performance checks.

## Traceability to Acceptance Tests

- AT-UC23-01: T018
- AT-UC23-02: T023
- AT-UC23-03: T024
- AT-UC23-04: T019
- AT-UC23-05: T031
- AT-UC23-06: T032
- AT-UC23-07: T033
- AT-UC23-08: T034
- AT-UC23-09: T035
