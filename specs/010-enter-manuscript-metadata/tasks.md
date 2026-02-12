# Tasks: Enter Manuscript Metadata

**Input**: Design documents from `/specs/010-enter-manuscript-metadata/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED. Include unit tests for model/controller logic and integration/acceptance tests mapped to AT-10.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create metadata feature scaffolding directories in `src/` and `tests/` per plan.md
- [ ] T002 [P] Add test harness utilities in `tests/test-helpers.js`
- [ ] T003 [P] Create base stylesheet stub in `styles/main.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [ ] T004 Create metadata validation service stub in `src/services/metadata-validation.js`
- [ ] T005 Create metadata storage service stub in `src/services/metadata-storage.js`
- [ ] T006 Create transient error log service stub in `src/services/metadata-error-log.js`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Enter Manuscript Metadata (Priority: P1) 🎯 MVP

**Goal**: Author enters, validates, saves, and drafts manuscript metadata with clear errors and persistence.

**Independent Test**: Author can save valid metadata, save a draft with partial metadata, and receive correct errors for invalid fields.

### Tests for User Story 1 (REQUIRED) ⚠️

- [ ] T007 [P] [US1] Acceptance test mapped to AT-10 in `tests/acceptance/at-uc10.test.js`
- [ ] T008 [P] [US1] Integration test for full metadata flow in `tests/integration/metadata-flow.test.js`
- [ ] T009 [P] [US1] Unit tests for manuscript metadata model in `tests/unit/manuscript-metadata.test.js`
- [ ] T010 [P] [US1] Unit tests for metadata draft lifecycle in `tests/unit/metadata-draft.test.js`
- [ ] T011 [P] [US1] Unit tests for validation rules in `tests/unit/metadata-validation.test.js`
- [ ] T012 [P] [US1] Unit tests for transient error log in `tests/unit/metadata-error-log.test.js`
- [ ] T013 [P] [US1] Performance check for <=200 ms validation feedback in `tests/integration/metadata-performance.test.js`

### Implementation for User Story 1

- [ ] T014 [P] [US1] Implement `ManuscriptMetadata` model in `src/models/manuscript-metadata.js`
- [ ] T015 [P] [US1] Implement `MetadataDraft` model and lifecycle in `src/models/metadata-draft.js`
- [ ] T016 [US1] Implement validation rules in `src/services/metadata-validation.js` (required fields, email format, keyword list 1–10, main source allowed values, abstract length limit, separator normalization)
- [ ] T017 [US1] Implement persistence in `src/services/metadata-storage.js` (draft save, final save, load, failure handling)
- [ ] T018 [US1] Implement transient error logging in `src/services/metadata-error-log.js`
- [ ] T019 [US1] Render metadata form and error states in `src/views/metadata-form-view.js`
- [ ] T020 [US1] Implement controller logic in `src/controllers/metadata-controller.js` (draft vs final save, validation, error messaging, editability rule)
- [ ] T021 [US1] Wire controller/view in `src/app.js`
- [ ] T022 [US1] Update `src/index.html` with metadata form fields and accessibility hooks
- [ ] T023 [US1] Update styling in `styles/main.css` for form layout and error visibility

**Checkpoint**: User Story 1 fully functional and testable independently

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple areas

- [ ] T024 [P] Run quickstart validation steps from `specs/010-enter-manuscript-metadata/quickstart.md`
- [ ] T025 [P] Update documentation comments in `src/controllers/metadata-controller.js`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **Polish (Phase 4)**: Depends on User Story 1 completion

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - no dependencies on other stories

### Parallel Opportunities

- T002, T003 can run in parallel
- T007–T012 can run in parallel
- T013–T014 can run in parallel
