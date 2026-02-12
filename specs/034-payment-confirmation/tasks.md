# Tasks: Payment Confirmation Ticket

**Input**: Design documents from `/specs/034-payment-confirmation/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED. Include unit tests for model/controller logic and integration/acceptance tests mapped to AT-XX.md cases.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Ensure MVC directories exist for confirmations in src/models/ src/services/ src/controllers/ src/views/
- [ ] T002 [P] Add confirmation routes placeholder in src/controllers/router.js
- [ ] T003 [P] Create confirmation view shell in src/views/confirmation_view.js
- [ ] T004 [P] Create confirmation error view shell in src/views/confirmation_error_view.js
- [ ] T005 [P] Create tickets list view shell in src/views/tickets_view.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 [P] Create TicketReceipt model in src/models/ticket_receipt.js
- [ ] T007 [P] Create ConfirmationRecord model in src/models/confirmation_record.js
- [ ] T008 [P] Create DeliveryLog model in src/models/delivery_log.js
- [ ] T009 [P] Implement confirmation storage helper in src/services/confirmation_storage_service.js
- [ ] T010 [P] Implement confirmation generation service in src/services/confirmation_generator_service.js
- [ ] T011 [P] Implement confirmation notification service (email + in-app) in src/services/confirmation_notification_service.js
- [ ] T012 [P] Implement delivery log service in src/services/delivery_log_service.js

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Receive payment confirmation (Priority: P1) 🎯 MVP

**Goal**: Generate and display confirmation after successful payment with required details.

**Independent Test**: Complete payment and confirm HTML confirmation summary shows all required fields.

### Tests for User Story 1 (REQUIRED) ⚠️

- [ ] T013 [P] [US1] Acceptance test for AT-UC34-01 in tests/acceptance/uc34_confirmation_generate.test.js
- [ ] T014 [P] [US1] Acceptance test for AT-UC34-02 in tests/acceptance/uc34_confirmation_display.test.js
- [ ] T015 [P] [US1] Integration test for confirmation generation in tests/integration/confirmation_generation.test.js
- [ ] T016 [P] [US1] Unit tests for confirmation details mapping in tests/unit/confirmation_generator.test.js

### Implementation for User Story 1

- [ ] T017 [US1] Generate confirmation with required details in src/services/confirmation_generator_service.js
- [ ] T018 [US1] Render confirmation HTML summary in src/views/confirmation_view.js
- [ ] T019 [US1] Implement confirmation controller action in src/controllers/confirmation_controller.js
- [ ] T020 [US1] Store confirmation record and receipt in src/services/confirmation_storage_service.js
- [ ] T021 [US1] Send confirmation notifications in src/services/confirmation_notification_service.js
- [ ] T022 [US1] Wire confirmation routes in src/controllers/router.js

**Checkpoint**: User Story 1 fully functional and testable independently

---

## Phase 4: User Story 2 - Handle confirmation failures (Priority: P2)

**Goal**: Handle generation/storage/notification failures with pending/error states and retries.

**Independent Test**: Simulate generation/storage/notification failures and verify pending/error messaging with logged retries.

### Tests for User Story 2 (REQUIRED) ⚠️

- [ ] T023 [P] [US2] Acceptance test for AT-UC34-03 in tests/acceptance/uc34_confirmation_pending.test.js
- [ ] T024 [P] [US2] Acceptance test for AT-UC34-04 in tests/acceptance/uc34_storage_failure.test.js
- [ ] T025 [P] [US2] Acceptance test for AT-UC34-05 in tests/acceptance/uc34_notification_failure.test.js
- [ ] T026 [P] [US2] Integration test for failure handling in tests/integration/confirmation_failure_flow.test.js
- [ ] T027 [P] [US2] Unit tests for delivery log behavior in tests/unit/delivery_log.test.js

### Implementation for User Story 2

- [ ] T028 [US2] Implement pending confirmation state and message in src/views/confirmation_error_view.js
- [ ] T029 [US2] Log generation/storage failures for reconciliation in src/services/delivery_log_service.js
- [ ] T030 [US2] Implement retry on next access for pending confirmations in src/services/confirmation_generator_service.js
- [ ] T031 [US2] Ensure ticket remains available after notification failure in src/services/confirmation_notification_service.js
- [ ] T032 [US2] Ensure storage failure shows error and keeps payment recorded in src/controllers/confirmation_controller.js

**Checkpoint**: User Stories 1 and 2 independently functional

---

## Phase 5: User Story 3 - Retrieve confirmation later (Priority: P3)

**Goal**: Allow authenticated attendees to retrieve confirmations later and prevent duplicates.

**Independent Test**: Access My Registration/Tickets and confirm retrieval without duplicates; unauthenticated access prompts login.

### Tests for User Story 3 (REQUIRED) ⚠️

- [ ] T033 [P] [US3] Acceptance test for AT-UC34-06 in tests/acceptance/uc34_tickets_retrieve.test.js
- [ ] T034 [P] [US3] Acceptance test for AT-UC34-07 in tests/acceptance/uc34_no_duplicate_ticket.test.js
- [ ] T035 [P] [US3] Integration test for ticket retrieval in tests/integration/ticket_retrieval.test.js
- [ ] T036 [P] [US3] Unit tests for confirmation access control in tests/unit/confirmation_access.test.js

### Implementation for User Story 3

- [ ] T037 [US3] Implement tickets list view in src/views/tickets_view.js
- [ ] T038 [US3] Implement tickets retrieval controller action in src/controllers/tickets_controller.js
- [ ] T039 [US3] Enforce authentication for confirmation view in src/controllers/confirmation_controller.js
- [ ] T039a [US3] Enforce authentication for tickets view in src/controllers/tickets_controller.js
- [ ] T040 [US3] Prevent duplicate ticket creation in src/services/confirmation_storage_service.js
- [ ] T040a [US3] Implement $0 registration confirmation generation in src/services/confirmation_generator_service.js

**Checkpoint**: All user stories independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T041 [P] Add performance validation for confirmation retrieval target in tests/performance/confirmation_retrieval_perf.test.js
- [ ] T042 [P] Add performance validation for 200 ms interaction target in tests/performance/confirmation_interaction_perf.test.js
- [ ] T043 [P] Add privacy checks for confirmation details visibility in tests/integration/confirmation_privacy.test.js
- [ ] T044 [P] Update quickstart verification steps in specs/034-payment-confirmation/quickstart.md

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

- Tests MUST be written and FAIL before implementation
- Models before services
- Services before controllers/views
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- Foundational model/service tasks T006–T012 can run in parallel
- View shells T003–T005 can run in parallel
- Tests for each user story (T013–T016, T023–T027, T033–T036) can run in parallel
- Polish tasks T041–T044 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch tests together:
Task: "Acceptance tests for AT-UC34-01/02 in tests/acceptance/uc34_*.test.js"
Task: "Integration test for confirmation generation in tests/integration/confirmation_generation.test.js"
Task: "Unit tests for confirmation generator in tests/unit/confirmation_generator.test.js"

# Launch model/service work together:
Task: "Create TicketReceipt model in src/models/ticket_receipt.js"
Task: "Create ConfirmationRecord model in src/models/confirmation_record.js"
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

## Traceability Map (UC-34 → S-34 → AT-UC34 → Tests)

- **UC-34 / S-34 / AT-UC34-01** → tests/acceptance/uc34_confirmation_generate.test.js (T013)
- **UC-34 / S-34 / AT-UC34-02** → tests/acceptance/uc34_confirmation_display.test.js (T014)
- **UC-34 / S-34 / AT-UC34-03** → tests/acceptance/uc34_confirmation_pending.test.js (T023)
- **UC-34 / S-34 / AT-UC34-04** → tests/acceptance/uc34_storage_failure.test.js (T024)
- **UC-34 / S-34 / AT-UC34-05** → tests/acceptance/uc34_notification_failure.test.js (T025)
- **UC-34 / S-34 / AT-UC34-06** → tests/acceptance/uc34_tickets_retrieve.test.js (T033)
- **UC-34 / S-34 / AT-UC34-07** → tests/acceptance/uc34_no_duplicate_ticket.test.js (T034)
