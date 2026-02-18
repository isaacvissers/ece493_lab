---

description: "Task list for UC-15 notify editor of assignment rule violations"
---

# Tasks: Notify Editor of Assignment Rule Violations

**Input**: Design documents from `/specs/015-notify-assignment-violations/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED. Include unit tests for model/controller logic and integration/acceptance tests mapped to AT-15.

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

- [x] T001 Verify MVC directory structure exists in src/models/, src/views/, src/controllers/, src/services/
- [x] T002 [P] Define localStorage keys and seed structures for reviewers, papers, assignments, review requests in src/services/storage.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Implement Reviewer model in src/models/reviewer.js
- [x] T004 [P] Implement Paper model in src/models/paper.js
- [x] T005 [P] Implement Assignment model (pending/accepted/rejected) in src/models/assignment.js
- [x] T006 [P] Implement Violation model in src/models/violation.js
- [x] T007 [P] Implement ReviewRequest model in src/models/review_request.js
- [x] T008 Implement assignment storage access layer in src/services/assignment-store.js
- [x] T009 Implement review-request storage access layer in src/services/review-request-store.js
- [x] T010 Implement rule evaluation service (email validity, duplicates, limit) in src/services/assignment-rules.js
- [x] T011 Implement violation logging service in src/services/violation-log.js

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Notify violations for a single assignment (Priority: P1) 🎯 MVP

**Goal**: Block invalid single assignments and notify editor; send reviewer email request on valid assignments.

**Independent Test**: Submit invalid single assignment to see clear violation; submit valid one and verify email request sent; accept creates assignment and reject leaves it unassigned.

### Tests for User Story 1 (REQUIRED) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T012 [P] [US1] Acceptance test for invalid email violation (AT-UC15-01) in tests/acceptance/at_uc15_01_invalid_email.test.js
- [x] T013 [P] [US1] Acceptance test for limit violation (AT-UC15-02) in tests/acceptance/at_uc15_02_limit_violation.test.js
- [x] T014 [P] [US1] Acceptance test for email request accept/reject (AT-UC15-07) in tests/acceptance/at_uc15_07_email_accept_reject.test.js
- [x] T015 [P] [US1] Integration test for single assignment flow in tests/integration/assign_single_with_email.test.js
- [x] T016 [P] [US1] Unit tests for rule evaluation service in tests/unit/assignment_rules.test.js

### Implementation for User Story 1

- [x] T017 [P] [US1] Add single-assignment service flow with violations in src/services/assignment-service.js
- [x] T018 [P] [US1] Send reviewer email request for valid assignments in src/services/review-request-service.js
- [x] T019 [P] [US1] Render violation messages for single assignment in src/views/assign-referees-view.js
- [x] T020 [US1] Wire single-assignment submit handling in src/controllers/assign-referees-controller.js

**Checkpoint**: User Story 1 functional and independently testable

---

## Phase 4: User Story 2 - Notify multiple violations and partial results (Priority: P2)

**Goal**: Report all violations and partial-apply valid assignments with per-entry outcomes.

**Independent Test**: Submit mixed-validity bulk request and receive per-entry outcome summary.

### Tests for User Story 2 (REQUIRED) ⚠️

- [x] T021 [P] [US2] Acceptance test for multiple violations reporting (AT-UC15-03) in tests/acceptance/at_uc15_03_multi_violation.test.js
- [x] T022 [P] [US2] Acceptance test for partial-apply outcomes (AT-UC15-04) in tests/acceptance/at_uc15_04_partial_apply.test.js
- [x] T023 [P] [US2] Integration test for bulk assignment with per-entry outcomes in tests/integration/assign_bulk_with_violations.test.js
- [x] T024 [P] [US2] Unit tests for violation aggregation in tests/unit/violation_aggregation.test.js

### Implementation for User Story 2

- [x] T025 [P] [US2] Add bulk-assignment service flow with per-entry outcomes in src/services/assignment-service.js
- [x] T026 [P] [US2] Render per-entry outcome summary in src/views/assign-referees-view.js
- [x] T027 [US2] Wire bulk input handling in src/controllers/assign-referees-controller.js

**Checkpoint**: User Stories 1 and 2 both functional and independently testable

---

## Phase 5: User Story 3 - Fail safely when evaluation or notification fails (Priority: P3)

**Goal**: Block assignments on evaluation/notification failures and log errors.

**Independent Test**: Simulate evaluation failure or UI notification failure and verify block + alternate feedback + logs.

### Tests for User Story 3 (REQUIRED) ⚠️

- [x] T028 [P] [US3] Acceptance test for evaluation failure block (AT-UC15-05) in tests/acceptance/at_uc15_05_eval_failure.test.js
- [x] T029 [P] [US3] Acceptance test for notification UI failure fallback (AT-UC15-06) in tests/acceptance/at_uc15_06_ui_failure_fallback.test.js
- [x] T030 [P] [US3] Integration test for failure logging and fallback in tests/integration/assignment_failure_handling.test.js
- [x] T031 [P] [US3] Unit tests for failure logging in tests/unit/violation_log.test.js

### Implementation for User Story 3

- [x] T032 [P] [US3] Add evaluation failure handling in src/services/assignment-service.js
- [x] T033 [P] [US3] Add notification failure fallback in src/views/assign-referees-view.js
- [x] T034 [US3] Ensure controller blocks invalid assignments on failures in src/controllers/assign-referees-controller.js
- [x] T035 [US3] Record evaluation/UI failures for admin review in src/services/violation-log.js

**Checkpoint**: All user stories functional and independently testable

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T036 [P] Add keyboard focus states for assignment UI elements in src/views/assign-referees-view.js
- [x] T037 [P] Validate keyboard operability for notification messaging in src/views/assign-referees-view.js
- [x] T038 [P] Add performance validation note for <=200 ms notifications in specs/015-notify-assignment-violations/quickstart.md
- [x] T039 [P] Update quickstart validation notes for UC-15 in specs/015-notify-assignment-violations/quickstart.md
- [x] T040 Run quickstart validation steps in specs/015-notify-assignment-violations/quickstart.md

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

- T003–T007 can run in parallel (separate model files)
- T017 and T019 can run in parallel (service vs view)
- T025 and T026 can run in parallel (service vs view)
- T032 and T033 can run in parallel (service vs view)
- T036 and T038 can run in parallel (UI vs docs)

---

## Parallel Example: User Story 1

```bash
Task: "Add single-assignment service flow with violations in src/services/assignment-service.js"
Task: "Render violation messages for single assignment in src/views/assign-referees-view.js"
```

---

## Parallel Example: User Story 2

```bash
Task: "Add bulk-assignment service flow with per-entry outcomes in src/services/assignment-service.js"
Task: "Render per-entry outcome summary in src/views/assign-referees-view.js"
```

---

## Parallel Example: User Story 3

```bash
Task: "Add evaluation failure handling in src/services/assignment-service.js"
Task: "Add notification failure fallback in src/views/assign-referees-view.js"
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
