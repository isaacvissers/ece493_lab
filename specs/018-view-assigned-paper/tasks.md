---

description: "Task list template for feature implementation"
---

# Tasks: View Accepted Assigned Paper in Reviewer Account

**Input**: Design documents from `/specs/018-view-assigned-paper/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED. Include unit tests for model/controller logic and
integration/acceptance tests mapped to AT-18 cases.

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
- [X] T002 [P] Create AT-18 integration test file in tests/integration/at-18-assignments.test.js
- [X] T003 [P] Create unit test skeleton for assignment list logic in tests/unit/reviewer-assignments.test.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Implement ReviewerAssignment data access helpers in src/models/reviewer-assignment.js
- [X] T005 Implement Paper data access helpers in src/models/paper.js
- [X] T006 [P] Implement Manuscript data access helpers in src/models/manuscript.js (handle missing/unavailable per FR-007)
- [X] T007 [P] Add assignment status constants in src/models/reviewer-assignment-status.js
- [X] T008 Implement shared error logging helper in src/services/error-log.js

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View accepted assignments list (Priority: P1) 🎯 MVP

**Goal**: List accepted assignments for the reviewer and show new ones on refresh.

**Independent Test**: Accepted papers appear in the assigned list and on refresh.

### Tests for User Story 1 (REQUIRED) ⚠️

- [X] T009 [P] [US1] Acceptance tests for AT-UC18-01..02 in tests/integration/at-18-assignments.test.js
- [X] T010 [P] [US1] Integration test for list refresh behavior in tests/integration/assignment-refresh.test.js
- [X] T011 [P] [US1] Unit tests for accepted-only filtering in tests/unit/reviewer-assignments.test.js

### Implementation for User Story 1

- [X] T012 [P] [US1] Implement accepted-assignment list query in src/services/reviewer-assignments.js
- [X] T013 [US1] Implement list controller action in src/controllers/reviewer-assignments-controller.js
- [X] T014 [US1] Update assigned papers list view in src/views/reviewer-assignments-view.js
- [X] T015 [US1] Wire list refresh action in src/controllers/reviewer-assignments-controller.js

**Checkpoint**: User Story 1 fully functional and testable independently

---

## Phase 4: User Story 2 - Open accepted paper details (Priority: P2)

**Goal**: Allow reviewers to open accepted papers and access manuscript details.

**Independent Test**: Accepted paper opens with details; unaccepted access is blocked.

### Tests for User Story 2 (REQUIRED) ⚠️

- [X] T016 [P] [US2] Acceptance tests for AT-UC18-03..04 in tests/integration/at-18-assignments.test.js
- [X] T017 [P] [US2] Integration test for accepted access vs denial in tests/integration/assignment-access.test.js
- [X] T018 [P] [US2] Unit tests for access control rules in tests/unit/assignment-access.test.js

### Implementation for User Story 2

- [X] T019 [P] [US2] Implement paper access service in src/services/reviewer-paper-access.js
- [X] T020 [US2] Implement paper details controller action in src/controllers/reviewer-paper-controller.js
- [X] T021 [US2] Update paper details view with manuscript link in src/views/reviewer-paper-view.js

**Checkpoint**: User Stories 1 and 2 both work independently

---

## Phase 5: User Story 3 - Handle visibility and retrieval errors (Priority: P3)

**Goal**: Show clear errors for retrieval failures, unavailable papers, and auth recovery.

**Independent Test**: Errors and recovery messaging are shown and logged.

### Tests for User Story 3 (REQUIRED) ⚠️

- [X] T022 [P] [US3] Acceptance tests for AT-UC18-05..08 in tests/integration/at-18-errors.test.js
- [X] T023 [P] [US3] Integration test for retrieval failure handling in tests/integration/assignment-retrieval-failure.test.js
- [X] T024 [P] [US3] Unit tests for error messaging rules in tests/unit/assignment-errors.test.js

### Implementation for User Story 3

- [X] T025 [P] [US3] Implement retrieval failure handling in src/services/reviewer-assignments.js
- [X] T026 [US3] Implement unavailable paper handling in src/services/reviewer-paper-access.js
- [X] T027 [US3] Update views to show error/recovery messages in src/views/reviewer-assignments-view.js
- [X] T028 [US3] Ensure controller logs failures via src/services/error-log.js
- [X] T029 [US3] Add login recovery redirect handling in src/controllers/auth-controller.js

**Checkpoint**: All user stories now independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T030 [P] Align terminology across reviewer views in src/views/
- [X] T031 [P] Verify accessibility focus states for error messages in src/views/reviewer-assignments-view.js
- [X] T032 [P] Add list retrieval performance check (<=2s) in tests/integration/assignment-performance.test.js
- [X] T033 Run quickstart validation checklist in specs/018-view-assigned-paper/quickstart.md

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
