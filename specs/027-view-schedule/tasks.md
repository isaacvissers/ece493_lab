# Tasks: View Conference Schedule (HTML)

**Input**: Design documents from `/specs/027-view-schedule/`
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

- [x] T001 Ensure MVC directories exist for schedule feature in src/models/ src/services/ src/controllers/ src/views/
- [x] T002 [P] Add schedule route placeholder in src/controllers/router.js
- [x] T003 [P] Create base HTML view shell for schedule in src/views/schedule_html_view.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 [P] Create Schedule model in src/models/schedule.js
- [x] T005 [P] Create ScheduleItem model in src/models/schedule_item.js
- [x] T006 [P] Create Conference model in src/models/conference.js
- [x] T007 [P] Create User model in src/models/user.js
- [x] T008 [P] Create AuditLog model in src/models/audit_log.js
- [x] T009 [P] Implement authorization helper for admin/editor in src/services/auth_service.js
- [x] T010 [P] Implement schedule retrieval service (published only) in src/services/schedule_service.js
- [x] T011 [P] Implement audit logging helper in src/services/audit_log_service.js
- [x] T012 [P] Add render performance timer utility in src/services/performance_service.js

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View HTML schedule (Priority: P1) 🎯 MVP

**Goal**: Render the published schedule as an HTML agenda list grouped by room.

**Independent Test**: Load HTML schedule for a conference with assignments and verify room/time entries render.

### Tests for User Story 1 (REQUIRED) ⚠️

- [x] T013 [P] [US1] Acceptance test for AT-UC27-01 in tests/acceptance/uc27_view_schedule_html.test.js
- [x] T014 [P] [US1] Acceptance test for AT-UC27-02 in tests/acceptance/uc27_view_schedule_html.test.js
- [x] T015 [P] [US1] Integration test for schedule HTML endpoint in tests/integration/schedule_html_endpoint.test.js
- [x] T016 [P] [US1] Unit tests for schedule rendering helpers in tests/unit/schedule_renderer.test.js

### Implementation for User Story 1

- [x] T017 [P] [US1] Implement agenda list renderer (group by room, chronological) in src/services/schedule_renderer.js
- [x] T018 [US1] Implement schedule HTML controller action in src/controllers/schedule_html_controller.js
- [x] T019 [US1] Wire schedule HTML route to controller in src/controllers/router.js
- [x] T020 [US1] Render HTML view using renderer output in src/views/schedule_html_view.js
- [x] T021 [US1] Ensure schedule service uses published schedule only in src/services/schedule_service.js

**Checkpoint**: User Story 1 fully functional and testable independently

---

## Phase 4: User Story 2 - Empty or partial schedules (Priority: P2)

**Goal**: Display clear messaging when schedules are missing or contain unscheduled items.

**Independent Test**: View HTML schedule with no schedule and with unscheduled items; verify messaging and section placement.

### Tests for User Story 2 (REQUIRED) ⚠️

- [x] T022 [P] [US2] Acceptance test for AT-UC27-03 in tests/acceptance/uc27_empty_schedule.test.js
- [x] T023 [P] [US2] Acceptance test for AT-UC27-04 in tests/acceptance/uc27_unscheduled_items.test.js
- [x] T024 [P] [US2] Integration test for no-schedule response in tests/integration/schedule_html_no_schedule.test.js
- [x] T025 [P] [US2] Unit tests for unscheduled section logic in tests/unit/schedule_renderer_unscheduled.test.js

### Implementation for User Story 2

- [x] T026 [US2] Add "No schedule available" handling in src/controllers/schedule_html_controller.js
- [x] T027 [US2] Render "Unscheduled" section for unscheduled items in src/services/schedule_renderer.js
- [x] T028 [US2] Add unscheduled labeling in src/views/schedule_html_view.js

**Checkpoint**: User Stories 1 and 2 independently functional

---

## Phase 5: User Story 3 - Errors and performance handling (Priority: P3)

**Goal**: Provide clear errors for auth and rendering failures, plus loading/timeout behavior.

**Independent Test**: Attempt unauthorized access, force render failure, and simulate slow rendering.

### Tests for User Story 3 (REQUIRED) ⚠️

- [x] T029 [P] [US3] Acceptance test for AT-UC27-05 in tests/acceptance/uc27_auth_denied.test.js
- [x] T030 [P] [US3] Acceptance test for AT-UC27-06 in tests/acceptance/uc27_render_failure.test.js
- [x] T031 [P] [US3] Acceptance test for AT-UC27-07 in tests/acceptance/uc27_timeout_loading.test.js
- [x] T032 [P] [US3] Integration test for timeout response in tests/integration/schedule_html_timeout.test.js
- [x] T033 [P] [US3] Unit tests for auth and logging on denial in tests/unit/schedule_auth_logging.test.js

### Implementation for User Story 3

- [x] T034 [US3] Enforce authorization check and denial logging in src/controllers/schedule_html_controller.js
- [x] T035 [US3] Log render failures and timeouts in src/services/audit_log_service.js
- [x] T036 [US3] Add loading indicator + timeout handling in src/views/schedule_html_view.js
- [x] T037 [US3] Add render timeout enforcement in src/services/performance_service.js

**Checkpoint**: All user stories independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T038 [P] Add performance validation for 200 ms interaction target in tests/performance/schedule_view_perf.test.js
- [x] T039 [P] Add rendering time validation for 300 items in tests/performance/schedule_render_perf.test.js
- [x] T040 [P] Add accessibility checklist verification for WCAG 2.1 AA in tests/integration/schedule_a11y.test.js
- [x] T041 [P] Update quickstart verification steps in specs/027-view-schedule/quickstart.md
- [x] T042 [P] Add log retention validation for 90-day audit logs in tests/integration/audit_log_retention.test.js

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
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1 renderer output
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Integrates with US1/US2 controller/view

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- Foundational model/service tasks T004–T012 can run in parallel
- Tests for each user story (T013–T016, T022–T025, T029–T033) can run in parallel
- Performance/accessibility tasks T038–T040 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Acceptance tests for AT-UC27-01/02 in tests/acceptance/uc27_view_schedule_html.test.js"
Task: "Integration test for schedule HTML endpoint in tests/integration/schedule_html_endpoint.test.js"
Task: "Unit tests for schedule renderer in tests/unit/schedule_renderer.test.js"

# Launch model/service tasks together:
Task: "Create Schedule model in src/models/schedule.js"
Task: "Create ScheduleItem model in src/models/schedule_item.js"
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

## Traceability Map (UC-27 → S-27 → AT-27 → Tests)

- **UC-27 / S-27 / AT-UC27-01** → tests/acceptance/uc27_view_schedule_html.test.js (T013)
- **UC-27 / S-27 / AT-UC27-02** → tests/acceptance/uc27_view_schedule_html.test.js (T014)
- **UC-27 / S-27 / AT-UC27-03** → tests/acceptance/uc27_empty_schedule.test.js (T022)
- **UC-27 / S-27 / AT-UC27-04** → tests/acceptance/uc27_unscheduled_items.test.js (T023)
- **UC-27 / S-27 / AT-UC27-05** → tests/acceptance/uc27_auth_denied.test.js (T029)
- **UC-27 / S-27 / AT-UC27-06** → tests/acceptance/uc27_render_failure.test.js (T030)
- **UC-27 / S-27 / AT-UC27-07** → tests/acceptance/uc27_timeout_loading.test.js (T031)
