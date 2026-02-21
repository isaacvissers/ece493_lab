# Tasks: Conference Registration

**Input**: Design documents from `/specs/031-conference-registration/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED. Include unit tests for model/controller logic and integration/acceptance tests mapped to AT-XX cases.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Ensure MVC directories exist for registration in src/models/ src/services/ src/controllers/ src/views/
- [x] T002 [P] Add registration route placeholder in src/controllers/router.js
- [x] T003 [P] Create base registration view shell in src/views/registration_view.js
- [x] T004 [P] Create registration status view shell in src/views/registration_status_view.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 [P] Create Registration model in src/models/registration.js
- [x] T006 [P] Create RegistrationWindow model in src/models/registration_window.js
- [x] T007 [P] Create Payment model in src/models/payment.js
- [x] T008 [P] Create Notification model in src/models/notification.js
- [x] T009 [P] Create RegistrationLog model in src/models/registration_log.js
- [x] T010 [P] Implement registration service (create + duplicate check) in src/services/registration_service.js
- [x] T011 [P] Implement window service (open/closed checks) in src/services/registration_window_service.js
- [x] T012 [P] Implement payment handling service in src/services/payment_service.js
- [x] T013 [P] Implement notification service (in-app + email) in src/services/notification_service.js
- [x] T014 [P] Implement registration logging helper in src/services/registration_log_service.js

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Register for the conference (Priority: P1) 🎯 MVP

**Goal**: Allow authenticated users to register during an open window with required details and confirmation.

**Independent Test**: Submit registration during open window and verify Registered status + confirmation.

### Tests for User Story 1 (REQUIRED) ⚠️

- [x] T015 [P] [US1] Acceptance test for AT-UC31-01 in tests/acceptance/uc31_register_success.test.js
- [x] T016 [P] [US1] Acceptance test for AT-UC31-02 in tests/acceptance/uc31_confirmation_delivery.test.js
- [x] T017 [P] [US1] Integration test for registration submit in tests/integration/registration_submit.test.js
- [x] T018 [P] [US1] Unit tests for registration validation in tests/unit/registration_service_validation.test.js

### Implementation for User Story 1

- [x] T019 [P] [US1] Render registration form fields in src/views/registration_view.js
- [x] T020 [US1] Implement registration controller action in src/controllers/registration_controller.js
- [x] T021 [US1] Wire registration route in src/controllers/router.js
- [x] T022 [US1] Validate required fields and create registration in src/services/registration_service.js
- [x] T023 [US1] Render confirmation receipt/summary in src/views/registration_status_view.js
- [x] T024 [US1] Send in-app + email confirmation on success in src/services/notification_service.js

**Checkpoint**: User Story 1 fully functional and testable independently

---

## Phase 4: User Story 2 - Registration closed (Priority: P2)

**Goal**: Block registration when the window is closed and show dates.

**Independent Test**: Attempt registration outside the window and verify closed message with dates.

### Tests for User Story 2 (REQUIRED) ⚠️

- [x] T025 [P] [US2] Acceptance test for AT-UC31-03 in tests/acceptance/uc31_registration_closed.test.js
- [x] T026 [P] [US2] Acceptance test for AT-UC31-04 in tests/acceptance/uc31_registration_window_dates.test.js
- [x] T027 [P] [US2] Integration test for closed-window response in tests/integration/registration_window_closed.test.js
- [x] T028 [P] [US2] Unit tests for window service in tests/unit/registration_window_service.test.js

### Implementation for User Story 2

- [x] T029 [US2] Show “Registration closed” with dates in src/views/registration_view.js
- [x] T030 [US2] Block registration when window is closed in src/services/registration_window_service.js

**Checkpoint**: User Stories 1 and 2 independently functional

---

## Phase 5: User Story 3 - Error handling and duplicate registration (Priority: P3)

**Goal**: Handle validation errors, duplicate registrations, save failures, and notification failures.

**Independent Test**: Trigger missing fields, duplicate registration, save failure, and notification failure flows.

### Tests for User Story 3 (REQUIRED) ⚠️

- [x] T031 [P] [US3] Acceptance test for AT-UC31-05 in tests/acceptance/uc31_validation_errors.test.js
- [x] T032 [P] [US3] Acceptance test for AT-UC31-06 in tests/acceptance/uc31_duplicate_registration.test.js
- [x] T033 [P] [US3] Acceptance test for AT-UC31-07 in tests/acceptance/uc31_save_failure.test.js
- [x] T034 [P] [US3] Acceptance test for AT-UC31-08 in tests/acceptance/uc31_notification_failure.test.js
- [x] T035 [P] [US3] Acceptance test for AT-UC31-09 in tests/acceptance/uc31_payment_failure.test.js
- [x] T036 [P] [US3] Integration test for duplicate registration detection in tests/integration/registration_duplicate.test.js
- [x] T037 [P] [US3] Integration test for save failure logging in tests/integration/registration_save_failure.test.js
- [x] T038 [P] [US3] Unit tests for notification failure logging in tests/unit/notification_failure_logging.test.js

### Implementation for User Story 3

- [x] T039 [US3] Highlight missing/invalid fields on submit in src/views/registration_view.js
- [x] T040 [US3] Prevent duplicate registration and show status in src/services/registration_service.js
- [x] T041 [US3] Log save failures in src/services/registration_log_service.js
- [x] T042 [US3] Log notification failures and keep Registered in src/services/registration_log_service.js
- [x] T043 [US3] Allow payment retry flow in src/services/payment_service.js

**Checkpoint**: All user stories independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T044 [P] Add performance validation for 200 ms interaction target in tests/performance/registration_perf.test.js
- [x] T045 [P] Add accessibility checks for registration form in tests/integration/registration_a11y.test.js
- [x] T046 [P] Add log retention validation for 90-day registration logs in tests/integration/registration_log_retention.test.js
- [x] T047 [P] Update quickstart verification steps in specs/031-conference-registration/quickstart.md

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
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- Foundational model/service tasks T005–T014 can run in parallel
- Tests for each user story (T015–T018, T025–T027, T030–T037) can run in parallel
- Performance/accessibility/log retention tasks T043–T045 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Acceptance tests for AT-UC31-01/02 in tests/acceptance/uc31_*.test.js"
Task: "Integration test for registration submit in tests/integration/registration_submit.test.js"
Task: "Unit tests for registration validation in tests/unit/registration_service_validation.test.js"

# Launch model/service tasks together:
Task: "Create Registration model in src/models/registration.js"
Task: "Create RegistrationWindow model in src/models/registration_window.js"
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

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

## Traceability Map (UC-31 → S-31 → AT-31 → Tests)

- **UC-31 / S-31 / AT-UC31-01** → tests/acceptance/uc31_register_success.test.js (T015)
- **UC-31 / S-31 / AT-UC31-02** → tests/acceptance/uc31_confirmation_delivery.test.js (T016)
- **UC-31 / S-31 / AT-UC31-03** → tests/acceptance/uc31_registration_closed.test.js (T025)
- **UC-31 / S-31 / AT-UC31-04** → tests/acceptance/uc31_registration_window_dates.test.js (T026)
- **UC-31 / S-31 / AT-UC31-05** → tests/acceptance/uc31_validation_errors.test.js (T031)
- **UC-31 / S-31 / AT-UC31-06** → tests/acceptance/uc31_duplicate_registration.test.js (T032)
- **UC-31 / S-31 / AT-UC31-07** → tests/acceptance/uc31_save_failure.test.js (T033)
- **UC-31 / S-31 / AT-UC31-08** → tests/acceptance/uc31_notification_failure.test.js (T034)
- **UC-31 / S-31 / AT-UC31-09** → tests/acceptance/uc31_payment_failure.test.js (T035)
