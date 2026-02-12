---

description: "Task list template for feature implementation"
---

# Tasks: Ensure Exactly Three Referees per Paper

**Input**: Design documents from `/specs/017-three-referees-per-paper/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED. Include unit tests for model/controller logic and
integration/acceptance tests mapped to AT-17 cases.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Verify MVC folder structure exists in src/models, src/views, src/controllers, src/services
- [ ] T002 [P] Create test skeletons for AT-17 coverage in tests/integration/at-17-readiness.test.js
- [ ] T003 [P] Create unit test skeletons for readiness logic in tests/unit/referee-readiness.test.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Implement RefereeAssignment data access helpers in src/models/referee-assignment.js
- [ ] T005 Implement ReadinessAudit model helpers in src/models/readiness-audit.js
- [ ] T006 [P] Implement referee count calculation utility in src/services/referee-count.js
- [ ] T007 [P] Add assignment status constants in src/models/referee-assignment-status.js
- [ ] T008 Implement shared error logging helper in src/services/error-log.js

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Enforce exactly three referees before review (Priority: P1) 🎯 MVP

**Goal**: Enforce readiness gating for exactly three non-declined assignments.

**Independent Test**: Readiness allows when count is exactly three and blocks otherwise.

### Tests for User Story 1 (REQUIRED) ⚠️

- [ ] T009 [P] [US1] Acceptance tests for AT-UC17-01..03 in tests/integration/at-17-readiness.test.js
- [ ] T010 [P] [US1] Integration test for readiness checkpoint flow in tests/integration/readiness-checkpoint.test.js
- [ ] T011 [P] [US1] Unit tests for count rules in tests/unit/referee-readiness.test.js
- [ ] T012 [P] [US1] Acceptance test for 4th-assignment block in tests/integration/at-17-readiness.test.js
- [ ] T013 [P] [US1] Acceptance test for missing invitations flag in tests/integration/at-17-readiness.test.js

### Implementation for User Story 1

- [ ] T014 [P] [US1] Implement readiness policy evaluator in src/services/referee-readiness.js
- [ ] T015 [P] [US1] Add readiness audit recording in src/services/readiness-audit.js
- [ ] T016 [P] [US1] Enforce 4th-assignment block in src/services/referee-assignment-guard.js
- [ ] T017 [P] [US1] Add missing invitation flagging in src/services/referee-invitation-check.js
- [ ] T018 [US1] Implement readiness controller action in src/controllers/review-readiness-controller.js
- [ ] T019 [US1] Update readiness view messaging in src/views/review-readiness-view.js
- [ ] T020 [US1] Wire readiness check into "Start review" flow in src/controllers/review-workflow-controller.js

**Checkpoint**: User Story 1 fully functional and testable independently

---

## Phase 4: User Story 2 - Guide editor to resolve referee count issues (Priority: P2)

**Goal**: Provide clear guidance to add/remove referees when count is incorrect.

**Independent Test**: When count != 3, UI shows message and action to add/remove.

### Tests for User Story 2 (REQUIRED) ⚠️

- [ ] T021 [P] [US2] Acceptance tests for AT-UC17-04..05 in tests/integration/at-17-guidance.test.js
- [ ] T022 [P] [US2] Integration test for add/remove guidance UI in tests/integration/referee-guidance.test.js
- [ ] T023 [P] [US2] Unit tests for guidance decision logic in tests/unit/referee-guidance.test.js

### Implementation for User Story 2

- [ ] T024 [P] [US2] Implement guidance message builder in src/services/referee-guidance.js
- [ ] T025 [US2] Add add/remove actions in src/controllers/referee-assignment-controller.js
- [ ] T026 [US2] Update guidance UI in src/views/referee-guidance-view.js
- [ ] T027 [US2] Connect guidance actions to readiness block state in src/controllers/review-readiness-controller.js

**Checkpoint**: User Stories 1 and 2 both work independently

---

## Phase 5: User Story 3 - Fail safely when count cannot be determined (Priority: P3)

**Goal**: Block readiness when count lookup fails and log the failure.

**Independent Test**: Lookup failure blocks readiness, shows error, and logs failure.

### Tests for User Story 3 (REQUIRED) ⚠️

- [ ] T028 [P] [US3] Acceptance test for AT-UC17-06..07 in tests/integration/at-17-failure.test.js
- [ ] T029 [P] [US3] Integration test for lookup failure handling in tests/integration/referee-count-failure.test.js
- [ ] T030 [P] [US3] Unit tests for fail-safe behavior in tests/unit/referee-fail-safe.test.js

### Implementation for User Story 3

- [ ] T031 [P] [US3] Implement fail-safe handling in src/services/referee-readiness.js
- [ ] T032 [US3] Surface error state in src/views/review-readiness-view.js
- [ ] T033 [US3] Ensure controller logs failures via src/services/error-log.js

**Checkpoint**: All user stories now independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T034 [P] Align terminology across readiness and guidance views in src/views/
- [ ] T035 [P] Verify accessibility focus states for readiness errors in src/views/review-readiness-view.js
- [ ] T036 [P] Add readiness performance check (<=2s) in tests/integration/readiness-performance.test.js
- [ ] T037 Run quickstart validation checklist in specs/017-three-referees-per-paper/quickstart.md

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
