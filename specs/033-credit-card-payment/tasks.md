# Tasks: Credit Card Payment

**Input**: Design documents from `/specs/033-credit-card-payment/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED. Include unit tests for model/controller logic and integration/acceptance tests mapped to AT-XX.md cases.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Ensure MVC directories exist for payments in src/models/ src/services/ src/controllers/ src/views/
- [X] T002 [P] Add payment routes placeholder in src/controllers/router.js
- [X] T003 [P] Create payment form view shell in src/views/payment_form_view.js
- [X] T004 [P] Create payment status view shell in src/views/payment_status_view.js
- [X] T005 [P] Create payment error view shell in src/views/payment_error_view.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 [P] Create Payment model in src/models/payment.js
- [X] T007 [P] Create RegistrationBalance model in src/models/registration_balance.js
- [X] T008 [P] Create PaymentReceipt model in src/models/payment_receipt.js
- [X] T009 [P] Create PaymentGatewayResponse model in src/models/payment_gateway_response.js
- [X] T010 [P] Implement payment storage helper in src/services/payment_storage_service.js
- [X] T011 [P] Implement payment gateway simulator in src/services/payment_gateway_service.js
- [X] T012 [P] Implement notification service (email + in-app) in src/services/payment_notification_service.js
- [X] T013 [P] Implement payment reconciliation helper in src/services/payment_reconciliation_service.js
- [X] T014 [P] Add 3-D Secure auth-required state handling in src/models/payment_gateway_response.js

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Pay by credit card (Priority: P1) 🎯 MVP

**Goal**: Allow authenticated attendees to submit credit card payments and receive confirmation/receipt.

**Independent Test**: Submit a valid card and receive confirmation + receipt without duplicate charges.

### Tests for User Story 1 (REQUIRED) ⚠️

- [X] T015 [P] [US1] Acceptance test for AT-UC33-01 in tests/acceptance/uc33_payment_success.test.js
- [X] T016 [P] [US1] Acceptance test for AT-UC33-02 in tests/acceptance/uc33_payment_cancel.test.js
- [X] T017 [P] [US1] Integration test for payment submission flow in tests/integration/payment_submit_flow.test.js
- [X] T018 [P] [US1] Unit tests for payment validation in tests/unit/payment_validation.test.js

### Implementation for User Story 1

- [X] T019 [US1] Implement payment form rendering with required fields in src/views/payment_form_view.js
- [X] T020 [US1] Implement payment form controller for submit/cancel in src/controllers/payment_controller.js
- [X] T021 [US1] Validate required card fields and idempotency key in src/services/payment_validation_service.js
- [X] T022 [US1] Implement authorize-then-capture flow in src/services/payment_service.js
- [X] T023 [US1] Generate receipt/transaction reference in src/services/payment_receipt_service.js
- [X] T024 [US1] Send confirmation notifications in src/services/payment_notification_service.js
- [X] T025 [US1] Wire payment routes in src/controllers/router.js

**Checkpoint**: User Story 1 fully functional and testable independently

---

## Phase 4: User Story 2 - Handle payment failures (Priority: P2)

**Goal**: Provide clear failure handling for invalid cards, gateway errors, persistence failures, and 3-D Secure.

**Independent Test**: Simulate invalid card, gateway error/timeout, persistence failure, and 3-D Secure failure.

### Tests for User Story 2 (REQUIRED) ⚠️

- [X] T026 [P] [US2] Acceptance test for AT-UC33-03 in tests/acceptance/uc33_invalid_card.test.js
- [X] T027 [P] [US2] Acceptance test for AT-UC33-04 in tests/acceptance/uc33_gateway_error.test.js
- [X] T028 [P] [US2] Acceptance test for AT-UC33-06 in tests/acceptance/uc33_persist_failure.test.js
- [X] T029 [P] [US2] Acceptance test for AT-UC33-07 in tests/acceptance/uc33_3ds_flow.test.js
- [X] T030 [P] [US2] Integration test for failure handling in tests/integration/payment_failure_flow.test.js
- [X] T031 [P] [US2] Unit tests for retry/idempotency in tests/unit/payment_idempotency.test.js

### Implementation for User Story 2

- [X] T032 [US2] Handle issuer decline and invalid card errors in src/services/payment_service.js
- [X] T033 [US2] Handle gateway errors/timeouts and generic failure messaging in src/views/payment_error_view.js
- [X] T034 [US2] Implement 3-D Secure required flow handling in src/controllers/payment_controller.js
- [X] T035 [US2] Persist auth-required status and resume flow in src/services/payment_service.js
- [X] T036 [US2] Implement persistence failure handling and reconciliation flagging in src/services/payment_reconciliation_service.js
- [X] T037 [US2] Ensure retry after failure does not duplicate charges in src/services/payment_service.js

**Checkpoint**: User Stories 1 and 2 independently functional

---

## Phase 5: User Story 3 - View payment status (Priority: P3)

**Goal**: Allow attendees to view payment status and support $0 bypass behavior.

**Independent Test**: After payment or $0 checkout, status view shows correct state and details.

### Tests for User Story 3 (REQUIRED) ⚠️

- [X] T038 [P] [US3] Acceptance test for AT-UC33-05 in tests/acceptance/uc33_payment_status.test.js
- [X] T039 [P] [US3] Acceptance test for AT-UC33-08 in tests/acceptance/uc33_zero_amount_bypass.test.js
- [X] T040 [P] [US3] Integration test for status view in tests/integration/payment_status_view.test.js
- [X] T041 [P] [US3] Unit tests for payment status mapping in tests/unit/payment_status_service.test.js

### Implementation for User Story 3

- [X] T042 [US3] Implement payment status view rendering in src/views/payment_status_view.js
- [X] T043 [US3] Implement payment status controller action in src/controllers/payment_status_controller.js
- [X] T044 [US3] Implement registration status lookup in src/services/payment_status_service.js
- [X] T045 [US3] Implement $0 total bypass logic in src/services/payment_service.js
- [X] T046 [US3] Implement confirmation-display fallback to payment status in src/controllers/payment_status_controller.js

**Checkpoint**: All user stories independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T047 [P] Add sensitive data handling safeguards (no plain-text storage) in src/services/payment_storage_service.js
- [X] T048 [P] Add performance validation for 200 ms submission target in tests/performance/payment_submit_perf.test.js
- [X] T049 [P] Add performance validation for 2s status view target in tests/performance/payment_status_perf.test.js
- [X] T050 [P] Add storage safety unit test for no plain-text card data in tests/unit/payment_storage_safety.test.js
- [X] T051 [P] Update quickstart verification steps in specs/033-credit-card-payment/quickstart.md

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
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1 services/views
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Integrates with US1/US2 services/views

### Within Each User Story

- Models before services
- Services before controllers/views
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- Foundational model/service tasks T006–T014 can run in parallel
- View shells T003–T005 can run in parallel
- Polish tasks T047–T051 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch view/controller work together:
Task: "Implement payment form rendering in src/views/payment_form_view.js"
Task: "Implement payment form controller in src/controllers/payment_controller.js"

# Launch service work together:
Task: "Implement authorize-then-capture in src/services/payment_service.js"
Task: "Generate receipt in src/services/payment_receipt_service.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Demo
3. Add User Story 2 → Test independently → Demo
4. Add User Story 3 → Test independently → Demo
5. Each story adds value without breaking previous stories

---

## Traceability Map (UC-33 → S-33 → AT-UC33 → Tests)

- **UC-33 / S-33 / AT-UC33-01** → tests/acceptance/uc33_payment_success.test.js (T015)
- **UC-33 / S-33 / AT-UC33-02** → tests/acceptance/uc33_payment_cancel.test.js (T016)
- **UC-33 / S-33 / AT-UC33-03** → tests/acceptance/uc33_invalid_card.test.js (T026)
- **UC-33 / S-33 / AT-UC33-04** → tests/acceptance/uc33_gateway_error.test.js (T027)
- **UC-33 / S-33 / AT-UC33-05** → tests/acceptance/uc33_payment_status.test.js (T038)
- **UC-33 / S-33 / AT-UC33-06** → tests/acceptance/uc33_persist_failure.test.js (T028)
- **UC-33 / S-33 / AT-UC33-07** → tests/acceptance/uc33_3ds_flow.test.js (T029)
- **UC-33 / S-33 / AT-UC33-08** → tests/acceptance/uc33_zero_amount_bypass.test.js (T039)
