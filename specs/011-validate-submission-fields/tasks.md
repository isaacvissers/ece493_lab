# Tasks: Validate Paper Submission Fields

**Input**: Design documents from `/specs/011-validate-submission-fields/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED. Include unit tests for model/controller logic and integration/acceptance tests mapped to AT-11.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create validation feature scaffolding in `src/` and `tests/` per plan.md
- [X] T002 [P] Add test harness utilities in `tests/test-helpers.js`
- [X] T003 [P] Create base stylesheet stub in `styles/main.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [X] T004 Create validation service stub in `src/services/submission-validation.js`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Validate Submission on Final Submit (Priority: P1) 🎯 MVP

**Goal**: Validate required fields, email, and manuscript file rules on final submit with clear, aggregated errors; allow permissive draft saves with format validation.

**Independent Test**: Valid final submit succeeds; missing/invalid fields block with clear errors; draft saves allow missing required fields but reject invalid formats.

### Tests for User Story 1 (REQUIRED) ⚠️

- [X] T005 [P] [US1] Acceptance tests mapped to AT-11 in `tests/acceptance/at-uc11.test.js`
- [X] T006 [P] [US1] Integration test for validation flow in `tests/integration/submission-validation-flow.test.js`
- [X] T007 [P] [US1] Unit tests for submission metadata model in `tests/unit/submission-metadata.test.js`
- [X] T008 [P] [US1] Unit tests for manuscript file model in `tests/unit/manuscript-file.test.js`
- [X] T009 [P] [US1] Unit tests for validation rules in `tests/unit/submission-validation.test.js`
- [X] T010 [P] [US1] Performance check for <=200 ms validation feedback in `tests/integration/validation-performance.test.js`

### Implementation for User Story 1

- [X] T011 [P] [US1] Implement `SubmissionMetadata` model in `src/models/submission-metadata.js`
- [X] T012 [P] [US1] Implement `ManuscriptFile` model in `src/models/manuscript-file.js`
- [X] T013 [P] [US1] Implement `DraftSubmission` model in `src/models/draft-submission.js`
- [X] T014 [US1] Implement validation rules in `src/services/submission-validation.js` (required fields, email format, file presence, accepted extensions, multi-error aggregation, draft format validation)
- [X] T015 [US1] Render validation errors and success states in `src/views/submission-form-view.js`
- [X] T016 [US1] Implement controller logic in `src/controllers/submission-validation-controller.js` (final submit vs draft save, validation, error messaging, confirmation)
- [X] T017 [US1] Wire controller/view in `src/app.js`
- [X] T018 [US1] Update `src/index.html` with required field indicators and accessibility hooks
- [X] T019 [US1] Update styling in `styles/main.css` for error visibility and focus states

**Checkpoint**: User Story 1 fully functional and testable independently

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple areas

- [ ] T020 [P] Run quickstart validation steps from `specs/011-validate-submission-fields/quickstart.md`
- [X] T021 [P] Update documentation comments in `src/controllers/submission-validation-controller.js`

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
- T005–T010 can run in parallel
- T011–T013 can run in parallel
