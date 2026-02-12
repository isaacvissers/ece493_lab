---

description: "Task list for UC-14 enforce reviewer assignment limit"
---

# Tasks: Enforce Reviewer Assignment Limit

**Input**: Design documents from `/specs/014-enforce-reviewer-limit/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED. Include unit tests for model/controller logic and integration/acceptance tests mapped to AT-14.

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

- [ ] T001 Verify MVC directory structure exists in src/models/, src/views/, src/controllers/, src/services/
- [ ] T002 [P] Define localStorage keys and seed structures for reviewers, papers, assignments in src/services/storage.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 [P] Implement Reviewer model (id, email, active count helpers) in src/models/reviewer.js
- [ ] T004 [P] Implement Paper model (id, status helpers) in src/models/paper.js
- [ ] T005 [P] Implement Assignment model (status, uniqueness helpers) in src/models/assignment.js
- [ ] T006 Implement assignment storage access layer in src/services/assignment-store.js
- [ ] T007 Implement reviewer assignment count lookup in src/services/reviewer-assignment-count.js
- [ ] T008 Implement assignment validation rules (limit, eligibility, no override) in src/services/assignment-validator.js

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Assign a reviewer within the limit (Priority: P1) 🎯 MVP

**Goal**: Allow single reviewer assignment when under the limit; block at the limit.

**Independent Test**: Assign a reviewer with 4 active assignments to an eligible paper and receive a success message; attempt with 5 shows limit message.

### Tests for User Story 1 (REQUIRED) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T009 [P] [US1] Acceptance test for under-limit assignment (AT-UC14-01) in tests/acceptance/at_uc14_01_under_limit.test.js
- [ ] T010 [P] [US1] Acceptance test for at-limit block (AT-UC14-02) in tests/acceptance/at_uc14_02_at_limit.test.js
- [ ] T011 [P] [US1] Acceptance test for boundary transition 4→5 then deny (AT-UC14-03) in tests/acceptance/at_uc14_03_boundary_transition.test.js
- [ ] T012 [P] [US1] Integration test for single assignment flow in tests/integration/assign_single_reviewer.test.js
- [ ] T013 [P] [US1] Unit tests for assignment validator rules in tests/unit/assignment_validator.test.js

### Implementation for User Story 1

- [ ] T014 [P] [US1] Add single-assignment service flow in src/services/assignment-service.js (lookup count, validate, create assignment)
- [ ] T015 [P] [US1] Render limit and success messages in src/views/assign-referees-view.js
- [ ] T016 [US1] Wire single-assignment submit handling in src/controllers/assign-referees-controller.js
- [ ] T017 [US1] Update routing/view initialization for assign referees UI in src/controllers/router.js

**Checkpoint**: User Story 1 functional and independently testable

---

## Phase 4: User Story 2 - Assign multiple reviewers with mixed eligibility (Priority: P2)

**Goal**: Allow bulk assignment with partial-apply results and per-reviewer summary.

**Independent Test**: Submit two reviewers (one under limit, one at limit) and receive a summary with one success and one rejection.

### Tests for User Story 2 (REQUIRED) ⚠️

- [ ] T018 [P] [US2] Acceptance test for mixed-eligibility bulk assignment (AT-UC14-05) in tests/acceptance/at_uc14_05_bulk_mixed.test.js
- [ ] T019 [P] [US2] Integration test for bulk assignment flow in tests/integration/assign_bulk_reviewers.test.js
- [ ] T020 [P] [US2] Unit tests for bulk assignment summary logic in tests/unit/assignment_summary.test.js

### Implementation for User Story 2

- [ ] T021 [P] [US2] Add bulk-assignment service flow (partial apply) in src/services/assignment-service.js
- [ ] T022 [P] [US2] Render per-reviewer assignment summary in src/views/assign-referees-view.js
- [ ] T023 [US2] Wire bulk input handling in src/controllers/assign-referees-controller.js

**Checkpoint**: User Stories 1 and 2 both functional and independently testable

---

## Phase 5: User Story 3 - Fail safely on lookup or save failures (Priority: P3)

**Goal**: Block assignments on lookup/save failures with clear errors.

**Independent Test**: Simulate lookup failure and save failure; both attempts are blocked with explicit error messages.

### Tests for User Story 3 (REQUIRED) ⚠️

- [ ] T024 [P] [US3] Acceptance test for lookup failure block (AT-UC14-04) in tests/acceptance/at_uc14_04_lookup_fail.test.js
- [ ] T025 [P] [US3] Acceptance test for save failure block (AT-UC14-06) in tests/acceptance/at_uc14_06_save_fail.test.js
- [ ] T026 [P] [US3] Acceptance test for concurrency limit enforcement (AT-UC14-07) in tests/acceptance/at_uc14_07_concurrency_limit.test.js
- [ ] T027 [P] [US3] Integration test for failure handling flow in tests/integration/assign_failure_paths.test.js
- [ ] T028 [P] [US3] Unit tests for service error mapping in tests/unit/assignment_errors.test.js

### Implementation for User Story 3

- [ ] T029 [P] [US3] Add explicit error codes/messages for lookup/save failures in src/services/assignment-service.js
- [ ] T030 [P] [US3] Add concurrency guard to prevent limit exceed in src/services/assignment-service.js
- [ ] T031 [US3] Display lookup/save failure messages in src/views/assign-referees-view.js
- [ ] T032 [US3] Ensure controller surfaces failure states without side effects in src/controllers/assign-referees-controller.js

**Checkpoint**: All user stories functional and independently testable

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T033 [P] Add keyboard focus states for assignment UI elements in src/views/assign-referees-view.js
- [ ] T034 [P] Verify keyboard operability (tab order/activation) for assignment UI in src/views/assign-referees-view.js
- [ ] T035 [P] Add performance validation note for <=200 ms response in specs/014-enforce-reviewer-limit/quickstart.md
- [ ] T036 [P] Update quickstart validation notes for UC-14 in specs/014-enforce-reviewer-limit/quickstart.md
- [ ] T037 Run quickstart validation steps in specs/014-enforce-reviewer-limit/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can proceed in parallel after Phase 2
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - no dependencies
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - builds on US1 services
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - builds on US1 services

### Parallel Opportunities

- T003–T005 can run in parallel (separate model files)
- T014 and T015 can run in parallel (service vs view)
- T018 and T019 can run in parallel (service vs view)
- T024 and T025 can run in parallel (service vs view)
- T033 and T035 can run in parallel (UI vs docs)

---

## Parallel Example: User Story 1

```bash
Task: "Add single-assignment service flow in src/services/assignment-service.js"
Task: "Render limit and success messages in src/views/assign-referees-view.js"
```

---

## Parallel Example: User Story 2

```bash
Task: "Add bulk-assignment service flow in src/services/assignment-service.js"
Task: "Render per-reviewer assignment summary in src/views/assign-referees-view.js"
```

---

## Parallel Example: User Story 3

```bash
Task: "Add explicit error codes/messages for lookup/save failures in src/services/assignment-service.js"
Task: "Display lookup/save failure messages in src/views/assign-referees-view.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Validate User Story 1 independently
5. Demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Validate independently → Demo (MVP)
3. Add User Story 2 → Validate independently → Demo
4. Add User Story 3 → Validate independently → Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
