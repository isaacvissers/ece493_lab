# Tasks: Edit and Update Conference Schedule

**Input**: Design documents from `/specs/028-edit-schedule/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED. Include unit tests for model/controller logic and
integration/acceptance tests mapped to AT-XX.md cases.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Ensure MVC directories exist for schedule editing in src/models/ src/services/ src/controllers/ src/views/
- [ ] T002 [P] Add schedule edit route placeholder in src/controllers/router.js
- [ ] T003 [P] Create base edit view shell in src/views/schedule_edit_view.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 [P] Create Schedule model with version in src/models/schedule.js
- [ ] T005 [P] Create ScheduleEntry model in src/models/schedule_entry.js
- [ ] T006 [P] Create Conference model (time window fields) in src/models/conference.js
- [ ] T007 [P] Create User model (editor/admin role) in src/models/user.js
- [ ] T008 [P] Create AuditLog model in src/models/audit_log.js
- [ ] T009 [P] Create NotificationLog model in src/models/notification_log.js
- [ ] T010 [P] Implement authorization helper for editor/admin in src/services/auth_service.js
- [ ] T011 [P] Implement schedule retrieval/update service (draft only) in src/services/schedule_service.js
- [ ] T012 [P] Implement conflict validation service in src/services/schedule_validation_service.js
- [ ] T013 [P] Implement audit logging helper in src/services/audit_log_service.js
- [ ] T014 [P] Implement notification trigger helper in src/services/notification_service.js

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Edit schedule entries (Priority: P1) 🎯 MVP

**Goal**: Edit room/time assignments with conflict and time-window validation.

**Independent Test**: Update a single entry to a valid slot and verify the change appears in schedule views.

### Tests for User Story 1 (REQUIRED) ⚠️

- [ ] T015 [P] [US1] Acceptance test for AT-UC28-01 in tests/acceptance/uc28_edit_schedule_success.test.js
- [ ] T016 [P] [US1] Acceptance test for AT-UC28-02 in tests/acceptance/uc28_html_view_updates.test.js
- [ ] T017 [P] [US1] Acceptance test for AT-UC28-03 in tests/acceptance/uc28_conflict_block.test.js
- [ ] T018 [P] [US1] Acceptance test for AT-UC28-04 in tests/acceptance/uc28_timewindow_block.test.js
- [ ] T019 [P] [US1] Integration test for edit endpoint in tests/integration/schedule_edit_endpoint.test.js
- [ ] T020 [P] [US1] Unit tests for conflict rules in tests/unit/schedule_validation_conflict.test.js
- [ ] T021 [P] [US1] Unit tests for time-window rules in tests/unit/schedule_validation_timewindow.test.js

### Implementation for User Story 1

- [ ] T022 [P] [US1] Implement edit form rendering in src/views/schedule_edit_view.js
- [ ] T023 [US1] Implement schedule edit controller action in src/controllers/schedule_edit_controller.js
- [ ] T024 [US1] Wire edit routes to controller in src/controllers/router.js
- [ ] T025 [US1] Enforce conflict + time-window validation in src/services/schedule_validation_service.js
- [ ] T026 [US1] Save draft updates and confirm success in src/services/schedule_service.js
- [ ] T027 [US1] Ensure HTML schedule view reflects draft after publish in src/services/schedule_service.js

**Checkpoint**: User Story 1 fully functional and testable independently

---

## Phase 4: User Story 2 - Unscheduling, missing schedule, and authorization (Priority: P2)

**Goal**: Enforce unscheduling prohibition, handle missing schedule, and block unauthorized edits.

**Independent Test**: Attempt removal without replacement, open with no schedule, and use unauthorized user.

### Tests for User Story 2 (REQUIRED) ⚠️

- [ ] T028 [P] [US2] Acceptance test for AT-UC28-05 in tests/acceptance/uc28_unschedule_block.test.js
- [ ] T029 [P] [US2] Acceptance test for AT-UC28-06 in tests/acceptance/uc28_no_schedule_edit.test.js
- [ ] T030 [P] [US2] Acceptance test for AT-UC28-07 in tests/acceptance/uc28_unauthorized_edit.test.js
- [ ] T031 [P] [US2] Integration test for no-schedule response in tests/integration/schedule_edit_no_schedule.test.js
- [ ] T032 [P] [US2] Unit tests for authorization checks in tests/unit/schedule_edit_auth.test.js

### Implementation for User Story 2

- [ ] T033 [US2] Block unscheduling without new assignment in src/services/schedule_validation_service.js
- [ ] T034 [US2] Handle no-schedule state in src/controllers/schedule_edit_controller.js
- [ ] T035 [US2] Enforce authorization and log denial in src/controllers/schedule_edit_controller.js

**Checkpoint**: User Stories 1 and 2 independently functional

---

## Phase 5: User Story 3 - Failure handling and concurrency (Priority: P3)

**Goal**: Handle DB failures, concurrency conflicts, and notification failures safely.

**Independent Test**: Simulate save failure, version mismatch, and notification failure.

### Tests for User Story 3 (REQUIRED) ⚠️

- [ ] T036 [P] [US3] Acceptance test for AT-UC28-08 in tests/acceptance/uc28_db_failure.test.js
- [ ] T037 [P] [US3] Acceptance test for AT-UC28-09 in tests/acceptance/uc28_concurrency_conflict.test.js
- [ ] T038 [P] [US3] Acceptance test for AT-UC28-10 in tests/acceptance/uc28_notification_failure.test.js
- [ ] T039 [P] [US3] Integration test for version mismatch response in tests/integration/schedule_edit_version_conflict.test.js
- [ ] T040 [P] [US3] Unit tests for persistence failure handling in tests/unit/schedule_service_failure.test.js

### Implementation for User Story 3

- [ ] T041 [US3] Detect version mismatch and require refresh in src/services/schedule_service.js
- [ ] T042 [US3] Handle save failure with error + logging in src/services/schedule_service.js
- [ ] T043 [US3] Trigger notifications after save and log failures in src/services/notification_service.js

**Checkpoint**: All user stories independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T044 [P] Add performance validation for 200 ms interaction target in tests/performance/schedule_edit_perf.test.js
- [ ] T045 [P] Add conflict detection performance validation for 300 items in tests/performance/schedule_conflict_perf.test.js
- [ ] T046 [P] Add accessibility checks for edit view in tests/integration/schedule_edit_a11y.test.js
- [ ] T047 [P] Add log retention validation for 90-day audit logs in tests/integration/audit_log_retention.test.js
- [ ] T048 [P] Update quickstart verification steps in specs/028-edit-schedule/quickstart.md

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
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1 controller/service
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Integrates with US1/US2 service flow

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- Foundational model/service tasks T004–T014 can run in parallel
- Tests for each user story (T015–T021, T028–T032, T036–T040) can run in parallel
- Performance/accessibility tasks T044–T047 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Acceptance tests for AT-UC28-01..04 in tests/acceptance/uc28_*.test.js"
Task: "Integration test for schedule edit endpoint in tests/integration/schedule_edit_endpoint.test.js"
Task: "Unit tests for validation rules in tests/unit/schedule_validation_*.test.js"

# Launch model/service tasks together:
Task: "Create Schedule model in src/models/schedule.js"
Task: "Create ScheduleEntry model in src/models/schedule_entry.js"
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

## Traceability Map (UC-28 → S-28 → AT-28 → Tests)

- **UC-28 / S-28 / AT-UC28-01** → tests/acceptance/uc28_edit_schedule_success.test.js (T015)
- **UC-28 / S-28 / AT-UC28-02** → tests/acceptance/uc28_html_view_updates.test.js (T016)
- **UC-28 / S-28 / AT-UC28-03** → tests/acceptance/uc28_conflict_block.test.js (T017)
- **UC-28 / S-28 / AT-UC28-04** → tests/acceptance/uc28_timewindow_block.test.js (T018)
- **UC-28 / S-28 / AT-UC28-05** → tests/acceptance/uc28_unschedule_block.test.js (T028)
- **UC-28 / S-28 / AT-UC28-06** → tests/acceptance/uc28_no_schedule_edit.test.js (T029)
- **UC-28 / S-28 / AT-UC28-07** → tests/acceptance/uc28_unauthorized_edit.test.js (T030)
- **UC-28 / S-28 / AT-UC28-08** → tests/acceptance/uc28_db_failure.test.js (T036)
- **UC-28 / S-28 / AT-UC28-09** → tests/acceptance/uc28_concurrency_conflict.test.js (T037)
- **UC-28 / S-28 / AT-UC28-10** → tests/acceptance/uc28_notification_failure.test.js (T038)
