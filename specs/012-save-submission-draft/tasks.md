# Tasks: Save Submission Draft

**Input**: Design documents from `/specs/012-save-submission-draft/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED. Include unit tests for model/controller logic and integration/acceptance tests mapped to AT-12.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure per plan in `src/`, `tests/`, and `styles/`
- [X] T002 Create base HTML shell and mount points in `index.html`
- [X] T003 [P] Create base styles and accessibility defaults in `styles/main.css`
- [X] T004 [P] Add app bootstrap and MVC wiring stub in `src/app.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [X] T005 [P] Implement draft storage abstraction (save/load/overwrite) in `src/services/draft-storage.js`
- [X] T006 [P] Implement transient error logging service in `src/services/draft-error-log.js`
- [X] T007 [P] Implement DraftSubmission model in `src/models/draft-submission.js`
- [X] T008 [P] Implement DraftSaveState model in `src/models/draft-save-state.js`
- [X] T009 Implement controller skeleton and error/readonly state hooks in `src/controllers/manuscript-submission-controller.js`
- [X] T010 Implement form view skeleton and indicator slots in `src/views/submit-manuscript-view.js`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Save Draft Progress (Priority: P1) 🎯 MVP

**Goal**: Allow authors to save, restore, and overwrite drafts with confirmation or alternate indicators and safe failure handling.

**Independent Test**: Save a partial draft, reopen to restore, and verify overwrite/failed save behaviors are handled correctly.

### Tests for User Story 1 (REQUIRED) ⚠️

- [X] T011 [P] [US1] Acceptance test mapped to AT-12 in `tests/acceptance/at-uc12.test.js`
- [X] T012 [P] [US1] Integration test for save/restore flow in `tests/integration/draft-flow.test.js`
- [X] T013 [P] [US1] Unit tests for draft models in `tests/unit/draft-submission.test.js`
- [X] T014 [P] [US1] Unit tests for save state model in `tests/unit/draft-save-state.test.js`
- [X] T015 [P] [US1] Unit tests for draft storage service in `tests/unit/draft-storage.test.js`

### Implementation for User Story 1

- [X] T016 [US1] Implement save draft controller flow (overwrite, warning for incomplete fields) in `src/controllers/manuscript-submission-controller.js`
- [X] T017 [US1] Implement load draft controller flow with readonly state on failure in `src/controllers/manuscript-submission-controller.js`
- [X] T018 [US1] Implement save confirmation and “Last saved at” indicator rendering in `src/views/submit-manuscript-view.js`
- [X] T019 [US1] Persist attachment reference in draft state in `src/models/draft-submission.js`
- [X] T020 [US1] Wire save/load storage calls and error logging in `src/services/draft-storage.js` and `src/services/draft-error-log.js`
- [X] T021 [US1] Handle session-expired redirect and return flow in `src/controllers/manuscript-submission-controller.js`
- [X] T022 [US1] Bind UI events and startup load in `src/app.js`
- [X] T023 [US1] Update submit form UI and indicator region in `src/views/submit-manuscript-view.js`

**Checkpoint**: User Story 1 functional and independently testable

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple flows

- [X] T024 [P] Validate performance thresholds (<=200 ms feedback, <50 ms main-thread) for save/load in `tests/acceptance/at-uc12.test.js`
- [X] T025 [P] Verify accessibility of save/load feedback (semantic HTML + keyboard navigation) in `tests/acceptance/at-uc12.test.js`
- [X] T026 [P] Run quickstart validation steps and align docs in `specs/012-save-submission-draft/quickstart.md`
- [X] T027 [P] Update documentation references in `specs/012-save-submission-draft/plan.md` if paths change

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: Depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on User Story 1 completion

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - no dependencies on other stories

### Within Each User Story

- Tests must be written and fail before implementation
- Models before services
- Services before controllers/views
- Core implementation before integration

### Parallel Opportunities

- T003, T004, T005, T006, T007, T008 can run in parallel
- T011–T015 tests can run in parallel
- T016–T021 are mostly sequential due to shared controller/view files

---

## Parallel Example: User Story 1

```bash
# Launch tests in parallel
Task: "Acceptance test in tests/acceptance/at-uc12.test.js"
Task: "Integration test in tests/integration/draft-flow.test.js"
Task: "Unit tests in tests/unit/draft-*.test.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Implement and test User Story 1
4. Polish and validate quickstart
