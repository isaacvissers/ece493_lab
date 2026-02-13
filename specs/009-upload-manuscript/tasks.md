# Tasks: Upload Manuscript File Within Constraints

**Input**: Design documents from `/specs/009-upload-manuscript/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED. Include unit tests for model/controller logic and
integration/acceptance tests mapped to AT-09.md cases.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create MVC folders and baseline files for file upload in src/
- [X] T002 [P] Add file-upload view entry point in src/app.js
- [X] T003 [P] Ensure base styles exist in styles/main.css for upload form and errors

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 [P] Create storage helpers in src/services/submission-storage.js
- [X] T005 [P] Create transient error logger in src/services/upload-error-log.js
- [X] T006 [P] Define manuscript file model in src/models/manuscript-file.js

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Upload Manuscript File (Priority: P1) 🎯 MVP

**Goal**: Authors can upload a valid manuscript file, see it attached, and handle invalid types/sizes or failures.

**Independent Test**: A logged-in author uploads valid files successfully; invalid type/size is rejected; failures allow retry; cancel leaves state unchanged.

### Tests for User Story 1 (REQUIRED) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T007 [P] [US1] Acceptance tests mapped to AT-09 in tests/acceptance/at-uc09.test.js
- [X] T008 [P] [US1] Integration test for upload flow in tests/integration/upload-manuscript-flow.test.js
- [X] T009 [P] [US1] Unit tests for file validation in tests/unit/manuscript-file.test.js (include case-insensitive extensions)
- [X] T010 [P] [US1] Integration test for replacement behavior in tests/integration/upload-manuscript-flow.test.js
- [X] T011 [P] [US1] Acceptance test for multi-file selection rejection in tests/acceptance/at-uc09.test.js

### Implementation for User Story 1

- [X] T012 [P] [US1] Implement file-upload view in src/views/file-upload-view.js
- [X] T013 [P] [US1] Implement file upload controller in src/controllers/file-upload-controller.js
- [X] T014 [US1] Wire view/controller to models and services in src/app.js
- [X] T015 [US1] Add validation for extensions (.pdf/.docx/.tex) and size in src/models/manuscript-file.js
- [X] T016 [US1] Implement upload retry + no-duplicate attachment logic in src/controllers/file-upload-controller.js
- [X] T017 [US1] Implement storage failure handling + transient logging in src/services/upload-error-log.js
- [X] T018 [US1] Implement cancel-selection handling and unchanged state in src/controllers/file-upload-controller.js
- [X] T019 [US1] Implement replacement behavior for new valid upload in src/controllers/file-upload-controller.js

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T020 [P] Accessibility pass for upload errors and focus states in src/views/file-upload-view.js
- [X] T021 [P] Update quickstart verification notes in specs/009-upload-manuscript/quickstart.md
- [X] T022 [P] Add quick performance check for validation response in tests/integration/upload-manuscript-flow.test.js
- [ ] T023 Run quickstart.md validation steps

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
- Validation before error handling and retry logic

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel
- All test tasks marked [P] can run in parallel
- Model and view/controller tasks marked [P] can run in parallel where they touch different files
