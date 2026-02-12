---

description: "Task list template for feature implementation"
---

# Tasks: Log in to CMS

**Input**: Design documents from `/specs/005-cms-login/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED. Include unit tests for model/controller logic and
integration/acceptance tests mapped to AT-05.md cases.

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

- [X] T004 [P] Define shared UI copy/constants for login errors in src/services/ui-messages.js
- [X] T005 Implement MVC wiring bootstrap in src/app.js
- [X] T006 Create traceability map UC-05 → S-05 → AT-05 → tests in /home/ivissers/ece_493/labs/lab2/lab2/specs/005-cms-login/traceability.md

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Log In to CMS (Priority: P1) 🎯 MVP

**Goal**: Authenticate registered users with email + password and redirect to home; reject invalid/missing credentials with clear errors; provide a registration option for new users.

**Independent Test**: Valid credentials authenticate and redirect to home; invalid/missing credentials show errors and remain unauthenticated; registration option is visible on the login form.

### Tests for User Story 1 (REQUIRED) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T007 [P] [US1] Acceptance tests mapped to AT-05 in tests/acceptance/at-uc05.test.js
- [X] T008 [P] [US1] Integration test for login flow in tests/integration/login-flow.test.js
- [X] T009 [P] [US1] Unit tests for login controller validation in tests/unit/login-controller.test.js
- [X] T010 [P] [US1] Unit tests for session state in tests/unit/session-state.test.js

### Implementation for User Story 1

- [X] T011 [US1] Implement login form view and error presentation in src/views/login-view.js
- [X] T012 [US1] Implement login controller (credential validation + redirect) in src/controllers/login-controller.js
- [X] T013 [US1] Implement user credential lookup in src/models/user-account.js
- [X] T014 [US1] Implement session state tracking in src/models/session-state.js
- [X] T015 [US1] Implement login failure logging (transient) in src/services/login-logging.js
- [X] T016 [US1] Wire login flow + registration navigation into app bootstrap in src/app.js
- [X] T017 [US1] Enforce protected page access gating based on session state in src/controllers/login-controller.js

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T018 [P] Documentation updates in /home/ivissers/ece_493/labs/lab2/lab2/specs/005-cms-login/quickstart.md
- [X] T019 [P] Code cleanup and refactoring for MVC boundaries in src/
- [X] T020 [P] Performance pass to ensure <=2s login validation + redirect in src/ and styles/

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
- Models/services before controllers/views
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
T007, T008, T009, T010
```

## Implementation Strategy

- Deliver MVP as User Story 1 only (login flow).
- Validate against AT-05 acceptance tests before polish tasks.
