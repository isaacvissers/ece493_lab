---

description: "Task list template for feature implementation"
---

# Tasks: Validate Registration Email

**Input**: Design documents from `/specs/002-validate-registration-email/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED. Include unit tests for model/controller logic and
integration/acceptance tests mapped to AT-02.md cases.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure per implementation plan (src/, styles/, tests/)
- [X] T002 Initialize base HTML/CSS/JS entry files in src/index.html, src/app.js, styles/main.css
- [X] T003 [P] Create test directory scaffolding in tests/unit/, tests/integration/, tests/acceptance/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Implement storage service for uniqueness lookups in src/services/storage-service.js
- [X] T005 Implement validation service for email format rules in src/services/validation-service.js
- [X] T006 [P] Define shared UI copy/constants for validation errors in src/services/ui-messages.js
- [X] T007 Implement MVC wiring bootstrap in src/app.js
- [X] T008 Create traceability map UC-02 → S-02 → AT-02 → tests in /home/ivissers/ece_493/labs/lab2/lab2/specs/002-validate-registration-email/traceability.md

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Validate Registration Email (Priority: P1) 🎯 MVP

**Goal**: Email is validated for format/uniqueness; failures block continuation with clear errors

**Independent Test**: A guest submits a valid unique email and proceeds; invalid format,
duplicate, or store failure blocks continuation with correct error and no partial state.

### Tests for User Story 1 (REQUIRED) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T009 [P] [US1] Acceptance tests mapped to AT-02 in tests/acceptance/at-uc02.test.js
- [X] T010 [P] [US1] Integration test for validation flow in tests/integration/registration-email-validation.test.js
- [X] T011 [P] [US1] Unit tests for validation rules (format, allowed chars, trim) in tests/unit/validation-service.test.js
- [X] T012 [P] [US1] Unit tests for uniqueness checks in tests/unit/storage-service.test.js
- [X] T013 [P] [US1] Unit tests for validation controller logic in tests/unit/registration-controller.test.js
- [X] T014 [P] [US1] Acceptance test assertion for accessible error announcement in tests/acceptance/at-uc02.test.js

### Implementation for User Story 1

- [X] T015 [P] [US1] Build registration email validation UI in src/views/registration-view.js
- [X] T016 [US1] Implement validation controller logic (format, uniqueness, short-circuit) in src/controllers/registration-controller.js
- [X] T017 [US1] Enforce case-insensitive uniqueness lookup in src/services/storage-service.js
- [X] T018 [US1] Implement whitespace trimming and allowed character checks in src/services/validation-service.js
- [X] T019 [US1] Implement invalid-format, duplicate, and store-failure messages in src/views/registration-view.js
- [X] T020 [US1] Implement failure logging for validation errors in src/services/storage-service.js
- [X] T021 [US1] Enforce no partial account state on validation failure in src/controllers/registration-controller.js
- [X] T022 [US1] Add accessible error presentation (semantic HTML / ARIA) in src/views/registration-view.js
- [X] T023 [US1] Wire validation flow into app bootstrap in src/app.js

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T024 [P] Documentation updates in /home/ivissers/ece_493/labs/lab2/lab2/specs/002-validate-registration-email/quickstart.md
- [X] T025 [P] Code cleanup and refactoring for MVC boundaries in src/
- [X] T026 [P] Performance pass to ensure <=200 ms validation interactions in src/ and styles/

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Services before controllers/views
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, user story tasks marked [P] can run in parallel
- All tests for a user story marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Parallelizable tasks for US1
T009, T010, T011, T012, T013, T014, T015
```

## Implementation Strategy

- Deliver MVP as User Story 1 only (email validation flow).
- Validate against AT-02 acceptance tests before polish tasks.
