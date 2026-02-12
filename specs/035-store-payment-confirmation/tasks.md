---

description: "Task list template for feature implementation"
---

# Tasks: Store Payment Confirmation

**Input**: Design documents from `/specs/035-store-payment-confirmation/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED. Include unit tests for model/controller logic and
integration/acceptance tests mapped to AT-UC35-XX cases.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create missing directories for MVC and tests in `src/models/`, `src/controllers/`, `src/services/`, `src/views/`, `tests/unit/`, `tests/integration/`, `tests/acceptance/`
- [ ] T002 [P] Add feature constants for storage keys and status values in `src/services/payment_constants.js`
- [ ] T003 [P] Add shared error types and result helpers in `src/services/payment_errors.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Implement localStorage + in-memory adapter in `src/services/storage_adapter.js`
- [ ] T005 [P] Implement HMAC verification helper in `src/services/hmac.js`
- [ ] T006 [P] Implement time/replay window helpers in `src/services/time_window.js`
- [ ] T007 [P] Implement idempotency index access in `src/services/idempotency_store.js`
- [ ] T008 Implement audit logging service with fallback path in `src/services/audit_logger.js`
- [ ] T009 Implement retry queue persistence + retrieval for status updates in `src/services/retry_queue.js`
- [ ] T010 Implement reconciliation queue for unmatched confirmations in `src/services/reconciliation_queue.js`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Store confirmation and update status (Priority: P1) 🎯 MVP

**Goal**: Store valid confirmations and update registration status to Paid/Confirmed.

**Independent Test**: Process a valid confirmation and verify confirmation persistence + registration status update.

### Tests for User Story 1 (REQUIRED) ⚠️

- [ ] T011 [P] [US1] Acceptance test for AT-UC35-01 in `tests/acceptance/test_uc35_store_confirmation.js`
- [ ] T012 [P] [US1] Acceptance test for AT-UC35-02 in `tests/acceptance/test_uc35_status_exposed.js`
- [ ] T013 [P] [US1] Integration test for redirect confirmation flow in `tests/integration/test_payment_confirmation_redirect.js`
- [ ] T014 [P] [US1] Integration test for webhook confirmation flow in `tests/integration/test_payment_confirmation_webhook.js`
- [ ] T015 [P] [US1] Unit tests for confirmation validation + storage in `tests/unit/test_confirmation_service.js`
- [ ] T016 [P] [US1] Unit tests for registration status update in `tests/unit/test_registration_order.js`
- [ ] T017 [P] [US1] Unit tests for downstream trigger payload + failure logging in `tests/unit/test_downstream_trigger.js`

### Implementation for User Story 1

- [ ] T018 [P] [US1] Create PaymentConfirmation model in `src/models/payment_confirmation.js`
- [ ] T019 [P] [US1] Create RegistrationOrder model with paid_at transition in `src/models/registration_order.js`
- [ ] T020 [P] [US1] Create AuditLogEntry model in `src/models/audit_log_entry.js`
- [ ] T021 [US1] Implement confirmation service (validate, store, status update) in `src/services/confirmation_service.js`
- [ ] T022 [US1] Implement redirect controller handler in `src/controllers/payment_confirmation_redirect_controller.js`
- [ ] T023 [US1] Implement webhook controller handler in `src/controllers/payment_confirmation_webhook_controller.js`
- [ ] T024 [US1] Implement downstream trigger dispatch + failure audit logging in `src/services/downstream_trigger.js`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Reject invalid or duplicate confirmations (Priority: P2)

**Goal**: Reject invalid confirmations and prevent duplicate processing via idempotency.

**Independent Test**: Submit an invalid confirmation and a duplicate confirmation and verify no status changes occur.

### Tests for User Story 2 (REQUIRED) ⚠️

- [ ] T025 [P] [US2] Acceptance test for AT-UC35-03 in `tests/acceptance/test_uc35_reject_invalid.js`
- [ ] T026 [P] [US2] Acceptance test for AT-UC35-04 in `tests/acceptance/test_uc35_idempotency.js`
- [ ] T027 [P] [US2] Integration test for invalid confirmation rejection in `tests/integration/test_confirmation_reject_invalid.js`
- [ ] T028 [P] [US2] Integration test for duplicate acknowledgement in `tests/integration/test_confirmation_duplicate.js`
- [ ] T029 [P] [US2] Unit tests for idempotency store behavior in `tests/unit/test_idempotency_store.js`

### Implementation for User Story 2

- [ ] T030 [P] [US2] Create UnmatchedPayment model in `src/models/unmatched_payment.js`
- [ ] T031 [US2] Enforce idempotency checks in `src/services/confirmation_service.js`
- [ ] T032 [US2] Implement unmatched confirmation handling in `src/services/reconciliation_queue.js`
- [ ] T033 [US2] Add validation failure response mapping in `src/controllers/payment_confirmation_redirect_controller.js`
- [ ] T034 [US2] Add validation failure response mapping in `src/controllers/payment_confirmation_webhook_controller.js`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Handle storage/update failures (Priority: P3)

**Goal**: Safely handle persistence, status update, and audit logging failures without corrupting data.

**Independent Test**: Simulate storage/update/logging failures and confirm queue/retry/fallback behavior without status corruption.

### Tests for User Story 3 (REQUIRED) ⚠️

- [ ] T035 [P] [US3] Acceptance test for AT-UC35-05 in `tests/acceptance/test_uc35_storage_failure.js`
- [ ] T036 [P] [US3] Acceptance test for AT-UC35-06 in `tests/acceptance/test_uc35_status_retry.js`
- [ ] T037 [P] [US3] Acceptance test for AT-UC35-07 in `tests/acceptance/test_uc35_audit_fallback.js`
- [ ] T038 [P] [US3] Integration test for storage failure reconciliation in `tests/integration/test_storage_failure_reconcile.js`
- [ ] T039 [P] [US3] Integration test for status update retry queue in `tests/integration/test_status_retry_queue.js`
- [ ] T040 [P] [US3] Unit tests for audit fallback logging in `tests/unit/test_audit_logger_fallback.js`

### Implementation for User Story 3

- [ ] T041 [P] [US3] Create AuditFallbackEntry model in `src/models/audit_fallback_entry.js`
- [ ] T042 [US3] Implement reconciliation queue persistence in `src/services/reconciliation_queue.js`
- [ ] T043 [US3] Implement retry queue processing for status updates in `src/services/retry_queue.js`
- [ ] T044 [US3] Implement audit fallback persistence + retrieval API in `src/services/audit_logger.js`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T045 [P] Add performance timing guardrails for confirmation processing in `src/services/perf_monitor.js`
- [ ] T046 [P] Add performance validation test for SC-005 in `tests/integration/test_confirmation_performance.js`
- [ ] T047 Update quickstart notes for confirmation ingestion and testing in `specs/035-store-payment-confirmation/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1 idempotency + validation
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Integrates with US1/US2 persistence + logging

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Models before services
- Services before controllers
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- Setup tasks marked [P] can run in parallel
- Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational completes, all user stories can start in parallel (if team capacity allows)
- Tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Traceability Map (UC-35 -> S-35 -> AT-UC35 -> Tests)

- **AT-UC35-01** → `tests/acceptance/test_uc35_store_confirmation.js`
- **AT-UC35-02** → `tests/acceptance/test_uc35_status_exposed.js`
- **AT-UC35-03** → `tests/acceptance/test_uc35_reject_invalid.js`
- **AT-UC35-04** → `tests/acceptance/test_uc35_idempotency.js`
- **AT-UC35-05** → `tests/acceptance/test_uc35_storage_failure.js`
- **AT-UC35-06** → `tests/acceptance/test_uc35_status_retry.js`
- **AT-UC35-07** → `tests/acceptance/test_uc35_audit_fallback.js`

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Acceptance test for AT-UC35-01 in tests/acceptance/test_uc35_store_confirmation.js"
Task: "Acceptance test for AT-UC35-02 in tests/acceptance/test_uc35_status_exposed.js"
Task: "Integration test for redirect confirmation flow in tests/integration/test_payment_confirmation_redirect.js"
Task: "Integration test for webhook confirmation flow in tests/integration/test_payment_confirmation_webhook.js"

# Launch all models for User Story 1 together:
Task: "Create PaymentConfirmation model in src/models/payment_confirmation.js"
Task: "Create RegistrationOrder model with paid_at transition in src/models/registration_order.js"
Task: "Create AuditLogEntry model in src/models/audit_log_entry.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Demo (MVP)
3. Add User Story 2 → Test independently → Demo
4. Add User Story 3 → Test independently → Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
