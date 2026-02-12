---

description: "Task list for UC-13 Assign Referees to Submitted Papers"
---

# Tasks: Assign Referees to Submitted Papers

**Input**: Design documents from `/specs/013-assign-referees/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED. Include unit tests for model/controller logic and integration/acceptance tests mapped to AT-13.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create base structure files in `src/app.js`, `src/index.html`, `styles/main.css`
- [ ] T002 Create test scaffold directories in `tests/unit/`, `tests/integration/`, `tests/acceptance/`
- [ ] T003 [P] Add base test harness setup in `tests/test-setup.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [ ] T004 Implement shared in-memory store wrapper in `src/services/assignment-storage.js`
- [ ] T005 [P] Implement shared error logging utility in `src/services/assignment-error-log.js`
- [ ] T006 [P] Implement base notification dispatcher stub in `src/services/notification-service.js`
- [ ] T007 Wire base routing/navigation entry in `src/app.js` for assignment view

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Assign referees to an eligible submitted paper (Priority: P1) 🎯 MVP

**Goal**: Editors can assign exactly three referees to a submitted paper, save assignments atomically, and send notifications.

**Independent Test**: Assign referees to a submitted paper and confirm assignments saved and notifications sent/warned on failure.

### Tests for User Story 1 (REQUIRED) ⚠️

- [ ] T008 [P] [US1] Acceptance tests for happy path + notification failure/retry in `tests/acceptance/at-uc13-us1.test.js` (maps AT-UC13-01, AT-UC13-10)
- [ ] T009 [P] [US1] Integration test for assignment flow in `tests/integration/referee-assignment-flow.test.js`
- [ ] T010 [P] [US1] Integration test for concurrent change blocking in `tests/integration/referee-assignment-concurrency.test.js`
- [ ] T011 [P] [US1] Unit tests for assignment model logic in `tests/unit/referee-assignment.test.js`
- [ ] T012 [P] [US1] Unit tests for notification log logic in `tests/unit/notification-log.test.js`
- [ ] T013 [P] [US1] Unit tests for notification retry behavior in `tests/unit/notification-service.test.js`

### Implementation for User Story 1

- [ ] T014 [P] [US1] Implement Paper model in `src/models/paper.js`
- [ ] T015 [P] [US1] Implement RefereeAssignment model in `src/models/referee-assignment.js`
- [ ] T016 [P] [US1] Implement NotificationLog model in `src/models/notification-log.js`
- [ ] T017 [US1] Implement assignment controller flow in `src/controllers/referee-assignment-controller.js`
- [ ] T018 [US1] Implement assignment view UI and confirmation banner in `src/views/referee-assignment-view.js`
- [ ] T019 [US1] Implement atomic save + notification dispatch orchestration in `src/services/assignment-storage.js`
- [ ] T020 [US1] Add success confirmation content (paper id + three emails) in `src/views/referee-assignment-view.js`
- [ ] T021 [US1] Add notification failure warning banner + log hook in `src/views/referee-assignment-view.js` and `src/services/assignment-error-log.js`
- [ ] T022 [US1] Implement single retry within 5 minutes in `src/services/notification-service.js`
- [ ] T023 [US1] Block assignment on concurrent change and prompt refresh in `src/controllers/referee-assignment-controller.js`
- [ ] T024 [US1] Ensure referee emails only render in assignment view/confirmation in `src/views/referee-assignment-view.js`

**Checkpoint**: User Story 1 is independently functional and testable

---

## Phase 4: User Story 2 - Block assignment when editor permissions or eligibility are missing (Priority: P2)

**Goal**: Non-editors or ineligible papers cannot assign referees; proper redirects and messages are shown.

**Independent Test**: Attempt assignment as non-editor or on ineligible paper and confirm blocked outcomes.

### Tests for User Story 2 (REQUIRED) ⚠️

- [ ] T025 [P] [US2] Acceptance tests for auth/eligibility in `tests/acceptance/at-uc13-us2.test.js` (maps AT-UC13-02, AT-UC13-03, AT-UC13-04)
- [ ] T026 [P] [US2] Integration test for auth/eligibility gating in `tests/integration/referee-assignment-auth.test.js`
- [ ] T027 [P] [US2] Unit tests for eligibility checks in `tests/unit/paper-eligibility.test.js`

### Implementation for User Story 2

- [ ] T028 [US2] Add eligibility and role checks in `src/controllers/referee-assignment-controller.js`
- [ ] T029 [US2] Add authorization error banner, exact authorization message text, and login redirect handling in `src/views/referee-assignment-view.js`
- [ ] T030 [US2] Implement session-expiry redirect and return-to-paper in `src/controllers/referee-assignment-controller.js`

**Checkpoint**: User Stories 1 and 2 are independently functional

---

## Phase 5: User Story 3 - Validate referee email inputs and prevent duplicates (Priority: P3)

**Goal**: Invalid/blank/duplicate email inputs are rejected with clear errors; exactly three unique emails required.

**Independent Test**: Submit invalid/blank/duplicate inputs and confirm errors shown and assignments blocked.

### Tests for User Story 3 (REQUIRED) ⚠️

- [ ] T031 [P] [US3] Acceptance tests for validation/duplicates in `tests/acceptance/at-uc13-us3.test.js` (maps AT-UC13-05 to AT-UC13-08)
- [ ] T032 [P] [US3] Integration test for validation errors in `tests/integration/referee-assignment-validation.test.js`
- [ ] T033 [P] [US3] Unit tests for email validation + uniqueness rules in `tests/unit/referee-validation.test.js`

### Implementation for User Story 3

- [ ] T034 [US3] Implement email validation and count enforcement in `src/controllers/referee-assignment-controller.js`
- [ ] T035 [US3] Implement duplicate detection (case-insensitive, trimmed) in `src/models/referee-assignment.js`
- [ ] T036 [US3] Block assignment when de-duplication yields fewer than three unique emails in `src/controllers/referee-assignment-controller.js`
- [ ] T037 [US3] Render aggregated validation errors and exact error messages (duplicate/invalid/count) near inputs in `src/views/referee-assignment-view.js`

**Checkpoint**: All user stories independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cross-story improvements and validation

- [ ] T038 [P] Apply accessibility focus states and keyboard operability in `styles/main.css`, `src/index.html`, `src/views/referee-assignment-view.js`
- [ ] T039 Update quickstart validation notes in `specs/013-assign-referees/quickstart.md`
- [ ] T040 [P] Run full AT-UC13 acceptance mapping checklist in `tests/acceptance/at-uc13.test.js`
- [ ] T041 [P] Verify interaction performance (<=200 ms) in `src/controllers/referee-assignment-controller.js`
- [ ] T042 [P] Validate main-thread task limits (<=50 ms) in `src/controllers/referee-assignment-controller.js`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup completion
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all desired user stories

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational
- **User Story 2 (P2)**: Starts after Foundational
- **User Story 3 (P3)**: Starts after Foundational

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Models before controller/view logic
- Controller logic before UI integration
- Story complete before moving to next priority

### Parallel Opportunities

- All test tasks marked [P] can run in parallel
- Model tasks within US1 can run in parallel
- US2 and US3 can proceed in parallel after Foundation

---

## Parallel Example: User Story 1

```bash
Task: "Acceptance tests in tests/acceptance/at-uc13-us1.test.js"
Task: "Integration test in tests/integration/referee-assignment-flow.test.js"
Task: "Integration test in tests/integration/referee-assignment-concurrency.test.js"
Task: "Unit tests in tests/unit/referee-assignment.test.js"
Task: "Unit tests in tests/unit/notification-log.test.js"
Task: "Unit tests in tests/unit/notification-service.test.js"
Task: "Create models in src/models/paper.js, src/models/referee-assignment.js, src/models/notification-log.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate User Story 1 independently

### Incremental Delivery

1. Setup + Foundational
2. User Story 1 → Validate
3. User Story 2 → Validate
4. User Story 3 → Validate
5. Polish & cross-cutting tasks
