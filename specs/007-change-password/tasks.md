---

description: "Task list template for feature implementation"
---

# Tasks: Change Password

**Input**: Design documents from `/specs/007-change-password/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED. Include unit tests for model/controller logic and
integration/acceptance tests mapped to AT-07.md cases.

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

- [ ] T004 [P] Define shared UI copy/constants for change-password errors in src/services/ui-messages.js
- [ ] T005 Implement MVC wiring bootstrap in src/app.js
- [ ] T006 Create traceability map UC-07 → S-07 → AT-07 → tests in /home/ivissers/ece_493/labs/lab2/lab2/specs/007-change-password/traceability.md

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Change Password (Priority: P1) 🎯 MVP

**Goal**: Verify current password, validate new password + confirmation, update credentials, and keep user logged in.

**Independent Test**: Valid change updates password and confirms success; invalid inputs show errors and do not update password.

### Tests for User Story 1 (REQUIRED) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T007 [P] [US1] Acceptance tests mapped to AT-07 in tests/acceptance/at-uc07.test.js
- [ ] T008 [P] [US1] Integration test for change-password flow in tests/integration/change-password-flow.test.js
- [ ] T009 [P] [US1] Unit tests for account controller validation in tests/unit/account-controller.test.js
- [ ] T010 [P] [US1] Unit tests for session state behavior in tests/unit/session-state.test.js

### Implementation for User Story 1

- [ ] T011 [US1] Implement change-password form + error UI in src/views/account-settings-view.js
- [ ] T012 [US1] Implement current-password verification and new-password validation in src/controllers/account-controller.js
- [ ] T013 [US1] Implement password update and confirmation logic in src/controllers/account-controller.js
- [ ] T014 [US1] Implement credential update in src/models/user-account.js
- [ ] T015 [US1] Implement transient error logging in src/services/password-error-logging.js
- [ ] T016 [US1] Ensure session remains authenticated after successful change in src/models/session-state.js
- [ ] T017 [US1] Enforce session-required access to change-password flow in src/controllers/account-controller.js
- [ ] T018 [US1] Wire change-password flow into app bootstrap in src/app.js

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T019 [P] Documentation updates in /home/ivissers/ece_493/labs/lab2/lab2/specs/007-change-password/quickstart.md
- [ ] T020 [P] Code cleanup and refactoring for MVC boundaries in src/
- [ ] T021 [P] Performance pass to ensure <=2s password change in src/ and styles/

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

- Deliver MVP as User Story 1 only (change password flow).
- Validate against AT-07 acceptance tests before polish tasks.
