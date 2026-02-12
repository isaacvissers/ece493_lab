---

description: "Task list template for feature implementation"
---

# Tasks: Access Review Form for Assigned Papers

**Input**: Design documents from `/specs/020-access-review-form/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED. Include unit tests for model/controller logic and
integration/acceptance tests mapped to AT-20 cases.

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
- [ ] T002 [P] Create AT-20 integration test file in tests/integration/at-20-review-form.test.js
- [ ] T003 [P] Create unit test skeleton for review form access in tests/unit/review-form-access.test.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Implement ReviewForm data access helpers in src/models/review-form.js
- [ ] T005 Implement ReviewDraft data access helpers in src/models/review-draft.js
- [ ] T006 [P] Implement ReviewerAssignment data access helpers in src/models/reviewer-assignment.js
- [ ] T007 [P] Implement Paper data access helpers in src/models/paper.js
- [ ] T008 Implement shared error logging helper in src/services/error-log.js

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Open review form for assigned paper (Priority: P1) 🎯 MVP

**Goal**: Allow reviewers with accepted assignments to open the review form and load drafts.

**Independent Test**: Accepted assignment opens form and loads draft when present.

### Tests for User Story 1 (REQUIRED) ⚠️

- [ ] T009 [P] [US1] Acceptance tests for AT-UC20-01..02 in tests/integration/at-20-review-form.test.js
- [ ] T010 [P] [US1] Integration test for draft loading in tests/integration/review-draft-load.test.js
- [ ] T011 [P] [US1] Unit tests for draft retrieval rules in tests/unit/review-form-access.test.js

### Implementation for User Story 1

- [ ] T012 [P] [US1] Implement review form access service in src/services/review-form-access.js (include closed-period view-only checks)
- [ ] T013 [P] [US1] Implement draft load logic in src/services/review-draft-load.js
- [ ] T014 [US1] Implement review form controller action in src/controllers/review-form-controller.js
- [ ] T015 [US1] Update review form view in src/views/review-form-view.js

**Checkpoint**: User Story 1 fully functional and testable independently

---

## Phase 4: User Story 2 - Enforce authorization and review period rules (Priority: P2)

**Goal**: Block unauthorized access and enforce closed-period view-only rules.

**Independent Test**: Unauthorized, unaccepted, or closed-period access is handled correctly.

### Tests for User Story 2 (REQUIRED) ⚠️

- [ ] T016 [P] [US2] Acceptance tests for AT-UC20-03..05 in tests/integration/at-20-review-form.test.js
- [ ] T017 [P] [US2] Integration test for closed-period view-only behavior in tests/integration/review-period-closed.test.js
- [ ] T018 [P] [US2] Unit tests for authorization checks in tests/unit/review-form-access.test.js

### Implementation for User Story 2

- [ ] T019 [P] [US2] Implement authorization guard in src/services/review-form-access.js
- [ ] T020 [US2] Implement closed-period view-only handling in src/controllers/review-form-controller.js
- [ ] T021 [US2] Update view to show closed-period message in src/views/review-form-view.js

**Checkpoint**: User Stories 1 and 2 both work independently

---

## Phase 5: User Story 3 - Handle missing form/data failures (Priority: P3)

**Goal**: Surface errors for missing form configuration or retrieval failures.

**Independent Test**: Missing form or retrieval failure shows error and logs failure.

### Tests for User Story 3 (REQUIRED) ⚠️

- [ ] T022 [P] [US3] Acceptance tests for AT-UC20-06..08 in tests/integration/at-20-review-form-errors.test.js
- [ ] T023 [P] [US3] Integration test for form missing error in tests/integration/review-form-missing.test.js
- [ ] T024 [P] [US3] Unit tests for error handling rules in tests/unit/review-form-errors.test.js

### Implementation for User Story 3

- [ ] T025 [P] [US3] Implement missing form detection in src/services/review-form-access.js
- [ ] T026 [US3] Implement retrieval failure handling in src/services/review-form-access.js
- [ ] T027 [US3] Update view with error states in src/views/review-form-view.js
- [ ] T028 [US3] Ensure controller logs failures via src/services/error-log.js

**Checkpoint**: All user stories now independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T029 [P] Align terminology across review form views in src/views/
- [ ] T030 [P] Verify accessibility focus states for review form errors in src/views/review-form-view.js
- [ ] T031 [P] Add form access performance check (<=2s) in tests/integration/review-form-performance.test.js
- [ ] T032 Run quickstart validation checklist in specs/020-access-review-form/quickstart.md

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
