# Tasks: Generate Conference Schedule

**Input**: Design documents from `/specs/026-generate-schedule/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED. Include unit tests for model/controller logic and integration/acceptance tests mapped to AT-UC26 cases.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create schedule storage helpers in `src/services/storage.js`
- [ ] T002 [P] Add scheduling layout markup in `src/views/schedule_layout.html`
- [ ] T003 [P] Add scheduling styles in `src/views/schedule.css`
- [ ] T004 Register scheduling routes in `src/controllers/router.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Implement auth/session guard utility in `src/services/auth_service.js`
- [ ] T006 [P] Implement Conference model in `src/models/conference.js`
- [ ] T007 [P] Implement Paper model in `src/models/paper.js`
- [ ] T008 [P] Implement Room model in `src/models/room.js`
- [ ] T009 [P] Implement TimeSlot model in `src/models/time_slot.js`
- [ ] T010 Implement Schedule model in `src/models/schedule.js`
- [ ] T011 Implement ScheduleItem model in `src/models/schedule_item.js`
- [ ] T012 Implement schedule repository in `src/services/schedule_repository.js`
- [ ] T013 Implement access control helper in `src/services/access_control.js`
- [ ] T014 Implement audit log service in `src/services/audit_log_service.js`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Generate draft schedule (Priority: P1) 🎯 MVP

**Goal**: Admins can generate a draft schedule and review assigned time/room per paper.

**Independent Test**: Provide valid inputs and accepted papers; generate schedule; verify draft assignments shown and stored.

### Tests for User Story 1 (REQUIRED) ⚠️

- [ ] T015 [P] [US1] Acceptance test for schedule generation (AT-UC26-01) in `tests/acceptance/test_schedule_generate.js`
- [ ] T016 [P] [US1] Acceptance test for draft persistence (AT-UC26-02) in `tests/acceptance/test_schedule_draft_persist.js`
- [ ] T017 [P] [US1] Integration test for generate → draft flow in `tests/integration/test_schedule_generate_flow.js`
- [ ] T018 [P] [US1] Unit tests for schedule repository in `tests/unit/test_schedule_repository.js`

### Implementation for User Story 1

- [ ] T019 [P] [US1] Implement schedule generation service in `src/services/schedule_generator.js`
- [ ] T020 [P] [US1] Implement schedule draft view in `src/views/schedule_draft_view.js`
- [ ] T021 [US1] Implement scheduling controller in `src/controllers/schedule_controller.js`
- [ ] T022 [US1] Wire generate action to controller in `src/controllers/schedule_controller.js`
- [ ] T023 [US1] Persist draft schedule in repository in `src/services/schedule_repository.js`

**Checkpoint**: User Story 1 fully functional and testable independently

---

## Phase 4: User Story 2 - Validate inputs and handle capacity/metadata (Priority: P2)

**Goal**: Missing inputs, capacity shortfalls, conflicts, and missing metadata are handled with clear feedback.

**Independent Test**: Omit required inputs or create capacity/metadata issues; verify blocking/partial draft responses.

### Tests for User Story 2 (REQUIRED) ⚠️

- [ ] T024 [P] [US2] Acceptance test for missing/invalid inputs (AT-UC26-03) in `tests/acceptance/test_schedule_inputs_invalid.js`
- [ ] T025 [P] [US2] Acceptance test for capacity shortfall (AT-UC26-04) in `tests/acceptance/test_schedule_capacity_shortfall.js`
- [ ] T026 [P] [US2] Acceptance test for missing metadata exclusion (AT-UC26-05) in `tests/acceptance/test_schedule_missing_metadata.js`
- [ ] T027 [P] [US2] Integration test for conflict detection and blocking in `tests/integration/test_schedule_conflicts.js`
- [ ] T028 [P] [US2] Unit tests for schedule validation rules in `tests/unit/test_schedule_validation.js`

### Implementation for User Story 2

- [ ] T029 [P] [US2] Implement scheduling input validation in `src/services/schedule_validation.js`
- [ ] T030 [US2] Enforce capacity checks in `src/services/schedule_generator.js`
- [ ] T031 [US2] Enforce conflict blocking in `src/services/schedule_generator.js`
- [ ] T032 [US2] Exclude and flag missing-metadata papers in `src/services/schedule_generator.js`
- [ ] T033 [US2] Display validation errors in `src/views/schedule_draft_view.js`

**Checkpoint**: User Stories 1 AND 2 work independently

---

## Phase 5: User Story 3 - Save and publish schedule (Priority: P3)

**Goal**: Draft schedules can be saved and optionally published with safe failure handling.

**Independent Test**: Save a draft; simulate save/publish failure and verify logs and state preservation.

### Tests for User Story 3 (REQUIRED) ⚠️

- [ ] T034 [P] [US3] Acceptance test for save draft (AT-UC26-06) in `tests/acceptance/test_schedule_save.js`
- [ ] T035 [P] [US3] Acceptance test for save failure (AT-UC26-07) in `tests/acceptance/test_schedule_save_fail.js`
- [ ] T036 [P] [US3] Acceptance test for publish failure handling (AT-UC26-08) in `tests/acceptance/test_schedule_publish_fail.js`
- [ ] T037 [P] [US3] Integration test for save/publish flow in `tests/integration/test_schedule_publish_flow.js`
- [ ] T038 [P] [US3] Unit tests for audit logging in `tests/unit/test_schedule_audit_log.js`

### Implementation for User Story 3

- [ ] T039 [P] [US3] Implement schedule save action in `src/services/schedule_repository.js`
- [ ] T040 [US3] Implement schedule publish action in `src/services/schedule_repository.js`
- [ ] T041 [US3] Implement save/publish controller actions in `src/controllers/schedule_controller.js`
- [ ] T042 [US3] Log save/publish failures in `src/services/audit_log_service.js`

**Checkpoint**: All user stories independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T043 [P] Add accessibility attributes for scheduling inputs and views in `src/views/schedule_draft_view.js`
- [ ] T044 [P] Add performance guardrails for generation timing in `src/services/schedule_generator.js`
- [ ] T045 Run quickstart validation steps from `specs/026-generate-schedule/quickstart.md`
- [ ] T046 [P] Implement audit log retention pruning (90 days) in `src/services/audit_log_service.js`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on generation/validation but remains independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Uses draft schedule output from US1/US2

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Models before services
- Services before controllers
- Controllers before views
- Story complete before moving to next priority

### Parallel Opportunities

- Setup tasks T002–T003 can run in parallel
- Foundational model tasks T006–T011 can run in parallel
- US1 tests (T015–T018) can run in parallel
- US2 tests (T024–T028) can run in parallel
- US3 tests (T034–T038) can run in parallel
