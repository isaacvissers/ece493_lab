---

description: "Task list template for feature implementation"
---

# Tasks: Alert Editor on Reviewer Over-Assignment

**Input**: Design documents from `/specs/019-alert-overassignment/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED. Include unit tests for model/controller logic and
integration/acceptance tests mapped to AT-19 cases.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Verify MVC folder structure exists in src/models, src/views, src/controllers, src/services
- [X] T002 [P] Create AT-19 integration test file in tests/integration/at-19-overassignment.test.js
- [X] T003 [P] Create unit test skeleton for reviewer count rules in tests/unit/reviewer-count.test.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Implement ReviewerAssignment data access helpers in src/models/reviewer-assignment.js
- [X] T005 Implement Paper data access helpers in src/models/paper.js
- [X] T006 [P] Add assignment status constants in src/models/reviewer-assignment-status.js
- [X] T007 [P] Implement reviewer count calculation utility in src/services/reviewer-count.js (count all assigned reviewers regardless of status)
- [X] T008 Implement shared error logging helper in src/services/error-log.js

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Alert on over-assignment (Priority: P1) 🎯 MVP

**Goal**: Detect and block over-assignment with alerts and guidance.

**Independent Test**: Adding a 4th reviewer is blocked with alert and guidance.

### Tests for User Story 1 (REQUIRED) ⚠️

- [X] T009 [P] [US1] Acceptance tests for AT-UC19-01..02 in tests/integration/at-19-overassignment.test.js
- [X] T010 [P] [US1] Integration test for over-assignment alert on view in tests/integration/overassignment-view-alert.test.js
- [X] T011 [P] [US1] Unit tests for blocking rule in tests/unit/reviewer-count.test.js

### Implementation for User Story 1

- [X] T012 [P] [US1] Implement over-assignment evaluator in src/services/overassignment-check.js
- [X] T013 [P] [US1] Implement alert payload builder in src/services/overassignment-alert.js
- [X] T014 [US1] Implement assignment controller block + alert in src/controllers/reviewer-assignment-controller.js
- [X] T015 [US1] Update alert UI in src/views/reviewer-assignments-view.js
- [X] T016 [US1] Add view-time alert check in src/controllers/reviewer-assignments-controller.js

**Checkpoint**: User Story 1 fully functional and testable independently

---

## Phase 4: User Story 2 - Handle batch assignment overages (Priority: P2)

**Goal**: Partially apply batch assignments and identify blocked additions.

**Independent Test**: Batch adds up to three and reports blocked additions.

### Tests for User Story 2 (REQUIRED) ⚠️

- [X] T017 [P] [US2] Acceptance tests for AT-UC19-03..04 in tests/integration/at-19-overassignment.test.js
- [X] T018 [P] [US2] Integration test for batch partial-apply in tests/integration/batch-overassignment.test.js
- [X] T019 [P] [US2] Unit tests for batch selection rules in tests/unit/batch-overassignment.test.js

### Implementation for User Story 2

- [X] T020 [P] [US2] Implement batch assignment handler in src/services/reviewer-batch-assign.js
- [X] T021 [US2] Integrate batch endpoint in src/controllers/reviewer-assignment-controller.js
- [X] T022 [US2] Update batch results UI in src/views/reviewer-assignments-view.js

**Checkpoint**: User Stories 1 and 2 both work independently

---

## Phase 5: User Story 3 - Fail safely on count/alert failures (Priority: P3)

**Goal**: Block assignment and surface fallback errors on count or UI failures.

**Independent Test**: Lookup failure blocks assignment, shows error, and logs failure.

### Tests for User Story 3 (REQUIRED) ⚠️

- [X] T023 [P] [US3] Acceptance tests for AT-UC19-05..08 in tests/integration/at-19-failures.test.js
- [X] T024 [P] [US3] Integration test for alert UI fallback in tests/integration/alert-fallback.test.js
- [X] T025 [P] [US3] Unit tests for fail-safe handling in tests/unit/overassignment-fail-safe.test.js

### Implementation for User Story 3

- [X] T026 [P] [US3] Implement count lookup failure handling in src/services/overassignment-check.js
- [X] T027 [US3] Implement alert UI fallback in src/views/reviewer-assignments-view.js
- [X] T028 [US3] Ensure controller logs failures via src/services/error-log.js

**Checkpoint**: All user stories now independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T029 [P] Align terminology across reviewer assignment views in src/views/
- [X] T030 [P] Verify accessibility focus states for alert messages in src/views/reviewer-assignments-view.js
- [X] T031 [P] Add assignment action performance check (<=2s) in tests/integration/overassignment-performance.test.js
- [X] T032 Run quickstart validation checklist in specs/019-alert-overassignment/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed) or sequentially in priority order
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P2)**: Can start after Foundational (Phase 2)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2)

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Models before services
- Services before controllers/views
- Core implementation before integration

### Parallel Opportunities

- Test files for each story can run in parallel
- Independent service and model tasks marked [P] can be done in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently
3. Add User Story 2 → Test independently
4. Add User Story 3 → Test independently
5. Run Polish tasks
