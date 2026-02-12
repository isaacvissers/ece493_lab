# Tasks: Submit Paper Manuscript

**Input**: Design documents from `/specs/008-submit-manuscript/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED. Include unit tests for model/controller logic and
integration/acceptance tests mapped to AT-08.md cases.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create MVC folders and baseline files for manuscript submission in src/
- [ ] T002 [P] Add submit-manuscript view entry point in src/app.js
- [ ] T003 [P] Ensure base styles exist in styles/main.css for form layout and errors

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 [P] Create storage helpers in src/services/submission-storage.js
- [ ] T005 [P] Create transient error logger in src/services/submission-error-log.js
- [ ] T006 [P] Define manuscript model in src/models/manuscript.js
- [ ] T007 [P] Define draft model in src/models/submission-draft.js

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Submit Paper Manuscript (Priority: P1) 🎯 MVP

**Goal**: Authors can submit a manuscript with required metadata + file, save/reopen drafts, and recover from validation or storage errors.

**Independent Test**: A logged-in author can complete a valid submission; invalid metadata/file inputs are rejected; draft can be saved and reopened; failures show errors and logging is transient.

### Tests for User Story 1 (REQUIRED) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T008 [P] [US1] Acceptance tests mapped to AT-08 scenarios in tests/acceptance/at-uc08.test.js (include unauthenticated redirect + storage failure)
- [ ] T009 [P] [US1] Integration test for submit flow in tests/integration/submit-manuscript-flow.test.js
- [ ] T010 [P] [US1] Unit tests for manuscript validation in tests/unit/manuscript.test.js
- [ ] T011 [P] [US1] Unit tests for draft save/reopen in tests/unit/submission-draft.test.js
- [ ] T012 [P] [US1] Integration test for draft reopen flow in tests/integration/submit-manuscript-flow.test.js
- [ ] T013 [P] [US1] Unit test for whitespace-only required fields in tests/unit/manuscript.test.js

### Implementation for User Story 1

- [ ] T014 [P] [US1] Implement submit-manuscript view in src/views/submit-manuscript-view.js
- [ ] T015 [P] [US1] Implement controller in src/controllers/manuscript-submission-controller.js
- [ ] T016 [US1] Wire view/controller to models and services in src/app.js
- [ ] T017 [US1] Add validation rules for required fields, email, author names, keywords in src/models/manuscript.js
- [ ] T018 [US1] Add file validation (type/size) and upload retry logic in src/controllers/manuscript-submission-controller.js
- [ ] T019 [US1] Implement draft save + reopen using src/models/submission-draft.js and src/services/submission-storage.js
- [ ] T020 [US1] Implement submission-unavailable error handling + transient logging in src/services/submission-error-log.js
- [ ] T021 [US1] Add Author Dashboard redirect on success in src/controllers/manuscript-submission-controller.js

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T022 [P] Accessibility pass for form errors and focus states in src/views/submit-manuscript-view.js
- [ ] T023 [P] Update quickstart verification notes in specs/008-submit-manuscript/quickstart.md
- [ ] T024 [P] Add quick performance check for interactive actions in tests/integration/submit-manuscript-flow.test.js
- [ ] T025 Run quickstart.md validation steps

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on User Story 1 completion

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories

### Within User Story 1

- Tests MUST be written and FAIL before implementation
- Models before controllers
- Controllers before view integration
- Validation before error handling and redirects

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel
- All test tasks marked [P] can run in parallel
- Model and view/controller tasks marked [P] can run in parallel where they touch different files
