---

description: "Task list template for feature implementation"
---

# Tasks: Redirect to Login After Registration

**Input**: Design documents from `/specs/004-login-redirect/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED. Include unit tests for model/controller logic and
integration/acceptance tests mapped to AT-04.md cases.

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

- [X] T004 [P] Define shared UI copy/constants for confirmation/redirect errors in src/services/ui-messages.js
- [X] T005 Implement MVC wiring bootstrap in src/app.js
- [X] T006 Create traceability map UC-04 → S-04 → AT-04 → tests in /home/ivissers/ece_493/labs/lab2/lab2/specs/004-login-redirect/traceability.md

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Redirect to Login After Registration (Priority: P1) 🎯 MVP

**Goal**: Show confirmation, redirect to login after a short delay, remain unauthenticated, and recover from redirect or auto-auth issues.

**Independent Test**: Successful registration shows confirmation, redirects to login, keeps user unauthenticated, and handles redirect failure with error + manual link.

### Tests for User Story 1 (REQUIRED) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T007 [P] [US1] Acceptance tests mapped to AT-04 in tests/acceptance/at-uc04.test.js
- [X] T008 [P] [US1] Integration test for registration redirect flow in tests/integration/registration-redirect-flow.test.js
- [X] T009 [P] [US1] Unit tests for registration controller redirect logic in tests/unit/registration-controller.test.js

### Implementation for User Story 1

- [X] T010 [US1] Implement confirmation display + redirect delay logic in src/controllers/registration-controller.js
- [X] T011 [P] [US1] Build confirmation/redirect UI state in src/views/registration-view.js
- [X] T012 [US1] Implement login view rendering for redirect destination in src/views/login-view.js
- [X] T013 [US1] Enforce login route as redirect destination in src/controllers/registration-controller.js
- [X] T014 [US1] Implement redirect failure handling + manual login link on confirmation view in src/views/registration-view.js
- [X] T015 [US1] Implement redirect failure logging in src/services/redirect-logging.js
- [X] T016 [US1] Detect auto-authentication and force logout + redirect to login in src/models/session-state.js
- [X] T017 [US1] Ensure login form unavailable state shows error on confirmation view in src/views/registration-view.js
- [X] T018 [US1] Wire redirect flow into app bootstrap in src/app.js

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T019 [P] Documentation updates in /home/ivissers/ece_493/labs/lab2/lab2/specs/004-login-redirect/quickstart.md
- [X] T020 [P] Code cleanup and refactoring for MVC boundaries in src/
- [X] T021 [P] Performance pass to ensure <=3s confirmation + redirect in src/ and styles/

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
T007, T008, T009, T011
```

## Implementation Strategy

- Deliver MVP as User Story 1 only (redirect-to-login flow).
- Validate against AT-04 acceptance tests before polish tasks.
