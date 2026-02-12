---

description: "Task list for UC-16 receive review invitation by email"
---

# Tasks: Receive Review Invitation by Email

**Input**: Design documents from `/specs/016-review-invitation-email/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED. Include unit tests for model/controller logic and integration/acceptance tests mapped to AT-16.

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
- [ ] T002 [P] Define localStorage keys and seed structures for invitations, reviewers, papers, assignments in src/services/storage.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 [P] Implement ReviewInvitation model in src/models/review_invitation.js
- [ ] T004 [P] Implement Reviewer model in src/models/reviewer.js
- [ ] T005 [P] Implement Paper model in src/models/paper.js
- [ ] T006 [P] Implement Assignment model in src/models/assignment.js
- [ ] T007 Implement invitation storage access layer in src/services/invitation-store.js
- [ ] T008 Implement response recording service in src/services/response-recorder.js
- [ ] T009 Implement invitation link validator (single-use, expiry) in src/services/invitation-link-validator.js
- [ ] T010 Implement invitation email sender wrapper in src/services/invitation-email.js
- [ ] T011 Implement failure logging service in src/services/invitation-log.js

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Receive and respond to invitation (Priority: P1) 🎯 MVP

**Goal**: Send invitations with accept/reject links and record responses.

**Independent Test**: Reviewer receives email and accepts/rejects; assignment status updates and confirmation appears.

### Tests for User Story 1 (REQUIRED) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T012 [P] [US1] Acceptance test for invitation email contents (AT-UC16-01) in tests/acceptance/at_uc16_01_invitation_email.test.js
- [ ] T013 [P] [US1] Acceptance test for accept response (AT-UC16-02) in tests/acceptance/at_uc16_02_accept_response.test.js
- [ ] T014 [P] [US1] Acceptance test for reject response (AT-UC16-03) in tests/acceptance/at_uc16_03_reject_response.test.js
- [ ] T015 [P] [US1] Integration test for respond flow in tests/integration/review_invitation_respond.test.js
- [ ] T016 [P] [US1] Unit tests for link validator in tests/unit/invitation_link_validator.test.js

### Implementation for User Story 1

- [ ] T017 [P] [US1] Create and send invitation in src/services/invitation-service.js
- [ ] T018 [P] [US1] Render reviewer confirmation page in src/views/reviewer-response-view.js
- [ ] T019 [US1] Wire respond controller in src/controllers/review-invitation-controller.js

**Checkpoint**: User Story 1 functional and independently testable

---

## Phase 4: User Story 2 - Handle invalid or expired links (Priority: P2)

**Goal**: Detect invalid/expired links and prevent recording responses.

**Independent Test**: Reviewer clicks an invalid/expired link and sees an error; duplicate responses are blocked.

### Tests for User Story 2 (REQUIRED) ⚠️

- [ ] T020 [P] [US2] Acceptance test for invalid/expired link error (AT-UC16-04) in tests/acceptance/at_uc16_04_invalid_link.test.js
- [ ] T021 [P] [US2] Acceptance test for duplicate response handling (AT-UC16-05) in tests/acceptance/at_uc16_05_duplicate_response.test.js
- [ ] T022 [P] [US2] Integration test for link validation failures in tests/integration/review_invitation_invalid_link.test.js
- [ ] T023 [P] [US2] Unit tests for duplicate response detection in tests/unit/response_dedup.test.js

### Implementation for User Story 2

- [ ] T024 [P] [US2] Add invalid/expired link handling in src/services/invitation-service.js
- [ ] T025 [P] [US2] Render invalid/expired link error in src/views/reviewer-response-view.js
- [ ] T026 [US2] Wire error handling paths in src/controllers/review-invitation-controller.js

**Checkpoint**: User Stories 1 and 2 both functional and independently testable

---

## Phase 5: User Story 3 - Fail safely on send or record failures (Priority: P3)

**Goal**: Block and log failures when sending invitations or recording responses.

**Independent Test**: Simulate send or record failure and verify logs and unchanged assignment state.

### Tests for User Story 3 (REQUIRED) ⚠️

- [ ] T027 [P] [US3] Acceptance test for send failure handling (AT-UC16-06) in tests/acceptance/at_uc16_06_send_failure.test.js
- [ ] T028 [P] [US3] Acceptance test for response record failure (AT-UC16-07) in tests/acceptance/at_uc16_07_record_failure.test.js
- [ ] T029 [P] [US3] Integration test for failure logging in tests/integration/review_invitation_failures.test.js
- [ ] T030 [P] [US3] Unit tests for failure logging in tests/unit/invitation_log.test.js

### Implementation for User Story 3

- [ ] T031 [P] [US3] Add send failure handling in src/services/invitation-service.js
- [ ] T032 [P] [US3] Add record failure handling in src/services/response-recorder.js
- [ ] T033 [US3] Ensure controller leaves assignment unchanged on failures in src/controllers/review-invitation-controller.js
- [ ] T034 [US3] Record send/record failures in src/services/invitation-log.js

**Checkpoint**: All user stories functional and independently testable

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T035 [P] Add keyboard focus states for reviewer response view in src/views/reviewer-response-view.js
- [ ] T036 [P] Validate keyboard operability for response view in src/views/reviewer-response-view.js
- [ ] T037 [P] Add performance validation note for 2-minute delivery SLA in specs/016-review-invitation-email/quickstart.md
- [ ] T038 [P] Update quickstart validation notes for UC-16 in specs/016-review-invitation-email/quickstart.md
- [ ] T039 Run quickstart validation steps in specs/016-review-invitation-email/quickstart.md

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

- T003–T006 can run in parallel (separate model files)
- T017 and T018 can run in parallel (service vs view)
- T024 and T025 can run in parallel (service vs view)
- T031 and T032 can run in parallel (service vs service)
- T035 and T037 can run in parallel (UI vs docs)

---

## Parallel Example: User Story 1

```bash
Task: "Create and send invitation in src/services/invitation-service.js"
Task: "Render reviewer confirmation page in src/views/reviewer-response-view.js"
```

---

## Parallel Example: User Story 2

```bash
Task: "Add invalid/expired link handling in src/services/invitation-service.js"
Task: "Render invalid/expired link error in src/views/reviewer-response-view.js"
```

---

## Parallel Example: User Story 3

```bash
Task: "Add send failure handling in src/services/invitation-service.js"
Task: "Add record failure handling in src/services/response-recorder.js"
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
