# Tasks: Final Schedule Delivery to Authors

**Input**: Design documents from `/specs/029-final-schedule-delivery/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED. Include unit tests for model/controller logic and
integration/acceptance tests mapped to AT-XX.md cases.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Ensure MVC directories exist for author schedule delivery in src/models/ src/services/ src/controllers/ src/views/
- [x] T002 [P] Add author schedule route placeholder in src/controllers/router.js
- [x] T003 [P] Create base author schedule view shell in src/views/author_schedule_view.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 [P] Create Schedule model in src/models/schedule.js
- [x] T005 [P] Create ScheduleEntry model in src/models/schedule_entry.js
- [x] T006 [P] Create Paper model in src/models/paper.js
- [x] T007 [P] Create Author model in src/models/author.js
- [x] T008 [P] Create Notification model in src/models/notification.js
- [x] T009 [P] Create AuditLog model in src/models/audit_log.js
- [x] T010 [P] Implement author access helper in src/services/author_access_service.js
- [x] T011 [P] Implement schedule retrieval service (published-only) in src/services/schedule_service.js
- [x] T012 [P] Implement notification delivery service (email + in-app) in src/services/notification_service.js
- [x] T013 [P] Implement audit logging helper in src/services/audit_log_service.js

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Receive final schedule (Priority: P1) 🎯 MVP

**Goal**: Allow accepted authors to view time/room details and receive notifications.

**Independent Test**: Publish a schedule and verify that an accepted author can view and receive details.

### Tests for User Story 1 (REQUIRED) ⚠️

- [x] T014 [P] [US1] Acceptance test for AT-UC29-01 in tests/acceptance/uc29_view_schedule.test.js
- [x] T015 [P] [US1] Acceptance test for AT-UC29-02 in tests/acceptance/uc29_notification_delivery.test.js
- [x] T016 [P] [US1] Integration test for author schedule endpoint in tests/integration/author_schedule_endpoint.test.js
- [x] T017 [P] [US1] Unit tests for schedule retrieval in tests/unit/schedule_service_published.test.js
- [x] T018 [P] [US1] Unit tests for notification delivery in tests/unit/notification_delivery.test.js

### Implementation for User Story 1

- [x] T019 [P] [US1] Implement author schedule view rendering in src/views/author_schedule_view.js
- [x] T020 [US1] Implement author schedule controller action in src/controllers/author_schedule_controller.js
- [x] T021 [US1] Wire author schedule route in src/controllers/router.js
- [x] T022 [US1] Return time/room details for accepted author in src/services/schedule_service.js
- [x] T023 [US1] Trigger email + in-app notifications after publish in src/services/notification_service.js
- [x] T024 [US1] Limit schedule details to time/room only in src/views/author_schedule_view.js

**Checkpoint**: User Story 1 fully functional and testable independently

---

## Phase 4: User Story 2 - Schedule not yet available (Priority: P2)

**Goal**: Show pending state before schedule publication.

**Independent Test**: Attempt to view schedule before publication and verify pending message.

### Tests for User Story 2 (REQUIRED) ⚠️

- [x] T025 [P] [US2] Acceptance test for AT-UC29-03 in tests/acceptance/uc29_pending_schedule.test.js
- [x] T026 [P] [US2] Integration test for unpublished schedule response in tests/integration/author_schedule_unpublished.test.js
- [x] T027 [P] [US2] Unit tests for pending state in tests/unit/schedule_service_pending.test.js
- [x] T028 [P] [US2] Acceptance test for AT-UC29-08 in tests/acceptance/uc29_publication_failure.test.js
- [x] T029 [P] [US2] Integration test for publication failure blocking details/notifications in tests/integration/author_schedule_publication_failed.test.js

### Implementation for User Story 2

- [x] T030 [US2] Show “Schedule not available yet” in src/views/author_schedule_view.js
- [x] T031 [US2] Block schedule details when not published in src/services/schedule_service.js
- [x] T032 [US2] Prevent details/notifications when publication fails in src/services/schedule_service.js

**Checkpoint**: User Stories 1 and 2 independently functional

---

## Phase 5: User Story 3 - Delivery failures and access issues (Priority: P3)

**Goal**: Handle notification failures, unauthorized access, and unscheduled accepted papers.

**Independent Test**: Simulate notification failure, unauthorized access, and unscheduled paper states.

### Tests for User Story 3 (REQUIRED) ⚠️

- [x] T033 [P] [US3] Acceptance test for AT-UC29-04 in tests/acceptance/uc29_notification_failure.test.js
- [x] T034 [P] [US3] Acceptance test for AT-UC29-05 in tests/acceptance/uc29_login_redirect.test.js
- [x] T035 [P] [US3] Acceptance test for AT-UC29-06 in tests/acceptance/uc29_unauthorized_access.test.js
- [x] T036 [P] [US3] Acceptance test for AT-UC29-07 in tests/acceptance/uc29_unscheduled_paper.test.js
- [x] T037 [P] [US3] Integration test for access denial in tests/integration/author_schedule_access_denied.test.js
- [x] T038 [P] [US3] Unit tests for access checks in tests/unit/author_access_service.test.js

### Implementation for User Story 3

- [x] T039 [US3] Log notification failures and keep access available in src/services/notification_service.js
- [x] T040 [US3] Enforce author association and log denial in src/services/author_access_service.js
- [x] T041 [US3] Redirect unauthenticated authors to login and back in src/controllers/author_schedule_controller.js
- [x] T042 [US3] Show “Unscheduled” with guidance in src/views/author_schedule_view.js

**Checkpoint**: All user stories independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T043 [P] Add performance validation for 200 ms interaction target in tests/performance/author_schedule_perf.test.js
- [x] T044 [P] Add retrieval time validation for 300 accepted papers in tests/performance/author_schedule_retrieval_perf.test.js
- [x] T045 [P] Add accessibility checks for author schedule view in tests/integration/author_schedule_a11y.test.js
- [x] T046 [P] Add log retention validation for 90-day audit logs in tests/integration/audit_log_retention.test.js
- [x] T047 [P] Update quickstart verification steps in specs/029-final-schedule-delivery/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1 services/views
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Integrates with US1/US2 services/views

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- Foundational model/service tasks T004–T013 can run in parallel
- Tests for each user story (T014–T018, T025–T027, T033–T038) can run in parallel
- Performance/accessibility tasks T043–T046 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Acceptance tests for AT-UC29-01/02 in tests/acceptance/uc29_*.test.js"
Task: "Integration test for author schedule endpoint in tests/integration/author_schedule_endpoint.test.js"
Task: "Unit tests for schedule service/notification delivery in tests/unit/*.test.js"

# Launch model/service tasks together:
Task: "Create Schedule model in src/models/schedule.js"
Task: "Create ScheduleEntry model in src/models/schedule_entry.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Demo
3. Add User Story 2 → Test independently → Demo
4. Add User Story 3 → Test independently → Demo
5. Each story adds value without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

## Traceability Map (UC-29 → S-29 → AT-29 → Tests)

- **UC-29 / S-29 / AT-UC29-01** → tests/acceptance/uc29_view_schedule.test.js (T014)
- **UC-29 / S-29 / AT-UC29-02** → tests/acceptance/uc29_notification_delivery.test.js (T015)
- **UC-29 / S-29 / AT-UC29-03** → tests/acceptance/uc29_pending_schedule.test.js (T025)
- **UC-29 / S-29 / AT-UC29-04** → tests/acceptance/uc29_notification_failure.test.js (T033)
- **UC-29 / S-29 / AT-UC29-05** → tests/acceptance/uc29_login_redirect.test.js (T034)
- **UC-29 / S-29 / AT-UC29-06** → tests/acceptance/uc29_unauthorized_access.test.js (T035)
- **UC-29 / S-29 / AT-UC29-07** → tests/acceptance/uc29_unscheduled_paper.test.js (T036)
- **UC-29 / S-29 / AT-UC29-08** → tests/acceptance/uc29_publication_failure.test.js (T028)
