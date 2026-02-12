---

description: "Task list template for feature implementation"
---

# Tasks: Reject Invalid Login Credentials

**Input**: Design documents from `/specs/006-reject-invalid-login/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED. Include unit tests for model/controller logic and
integration/acceptance tests mapped to AT-06.md cases.

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

- [ ] T001 Create project structure per implementation plan (src/, styles/, tests/)
- [ ] T002 Initialize base HTML/CSS/JS entry files in src/index.html, src/app.js, styles/main.css
- [ ] T003 [P] Create test directory scaffolding in tests/unit/, tests/integration/, tests/acceptance/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 [P] Define shared UI copy/constants for invalid-credential errors in src/services/ui-messages.js
- [ ] T005 Implement MVC wiring bootstrap in src/app.js
- [ ] T006 Create traceability map UC-06 → S-06 → AT-06 → tests in /home/ivissers/ece_493/labs/lab2/lab2/specs/006-reject-invalid-login/traceability.md

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Reject Invalid Login Credentials (Priority: P1) 🎯 MVP

**Goal**: Reject invalid credentials with a single generic error, keep user unauthenticated, allow retry, and log failures transiently.

**Independent Test**: Invalid credentials always reject login, show the generic error, and do not authenticate; DB failures show login-unavailable error and are logged.

### Tests for User Story 1 (REQUIRED) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T007 [P] [US1] Acceptance tests mapped to AT-06 in tests/acceptance/at-uc06.test.js
- [ ] T008 [P] [US1] Integration test for invalid login flow in tests/integration/invalid-login-flow.test.js
- [ ] T009 [P] [US1] Unit tests for login controller rejection logic in tests/unit/login-controller.test.js
- [ ] T010 [P] [US1] Unit tests for session state (no auth on failure) in tests/unit/session-state.test.js

### Implementation for User Story 1

- [ ] T011 [US1] Implement generic error rendering in src/views/login-view.js
- [ ] T012 [US1] Implement invalid-credential rejection in src/controllers/login-controller.js
- [ ] T013 [US1] Implement credential lookup failure handling in src/controllers/login-controller.js
- [ ] T014 [US1] Implement transient failure logging in src/services/login-logging.js
- [ ] T015 [US1] Enforce no authenticated session on invalid login in src/models/session-state.js
- [ ] T016 [US1] Ensure protected pages remain blocked after invalid login in src/controllers/login-controller.js
- [ ] T017 [US1] Wire invalid-login handling into app bootstrap in src/app.js

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T018 [P] Documentation updates in /home/ivissers/ece_493/labs/lab2/lab2/specs/006-reject-invalid-login/quickstart.md
- [ ] T019 [P] Code cleanup and refactoring for MVC boundaries in src/
- [ ] T020 [P] Performance pass to ensure <=2s invalid-credential rejection in src/ and styles/

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

- Deliver MVP as User Story 1 only (invalid login rejection).
- Validate against AT-06 acceptance tests before polish tasks.
