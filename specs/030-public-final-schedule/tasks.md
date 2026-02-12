# Tasks: Public Final Schedule Announcement

**Input**: Design documents from `/specs/030-public-final-schedule/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED. Include unit tests for model/controller logic and integration/acceptance tests mapped to AT-XX cases.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Ensure MVC directories exist for public schedule delivery in src/models/ src/services/ src/controllers/ src/views/
- [ ] T002 [P] Add public schedule route placeholder in src/controllers/router.js
- [ ] T003 [P] Create base public schedule view shell in src/views/public_schedule_view.js
- [ ] T004 [P] Create announcement banner view shell in src/views/schedule_announcement_view.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 [P] Create PublicSchedule model in src/models/public_schedule.js
- [ ] T006 [P] Create ScheduleEntry model in src/models/schedule_entry.js
- [ ] T007 [P] Create Announcement model in src/models/announcement.js
- [ ] T008 [P] Create PublicationLog model in src/models/publication_log.js
- [ ] T009 [P] Implement public schedule retrieval service in src/services/public_schedule_service.js
- [ ] T010 [P] Implement announcement retrieval service in src/services/announcement_service.js
- [ ] T011 [P] Implement publication/render logging helper in src/services/publication_log_service.js

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View public final schedule (Priority: P1) 🎯 MVP

**Goal**: Allow public attendees to view published schedule by day/time/room/session with titles/authors/abstracts.

**Independent Test**: Publish a schedule and verify public page shows readable listings and announcement link.

### Tests for User Story 1 (REQUIRED) ⚠️

- [ ] T012 [P] [US1] Acceptance test for AT-UC30-01 in tests/acceptance/uc30_public_schedule_view.test.js
- [ ] T013 [P] [US1] Acceptance test for AT-UC30-02 in tests/acceptance/uc30_readable_listings.test.js
- [ ] T014 [P] [US1] Integration test for /public/schedule response in tests/integration/public_schedule_endpoint.test.js
- [ ] T015 [P] [US1] Integration test for announcement link placement in tests/integration/schedule_announcement_link.test.js
- [ ] T016 [P] [US1] Unit tests for public schedule service in tests/unit/public_schedule_service.test.js

### Implementation for User Story 1

- [ ] T017 [P] [US1] Render schedule listing layout in src/views/public_schedule_view.js
- [ ] T018 [US1] Implement public schedule controller action in src/controllers/public_schedule_controller.js
- [ ] T019 [US1] Wire public schedule route in src/controllers/router.js
- [ ] T020 [US1] Return day/time/room/session + titles/authors/abstracts in src/services/public_schedule_service.js
- [ ] T021 [US1] Render schedule announcement banner with link in src/views/schedule_announcement_view.js

**Checkpoint**: User Story 1 fully functional and testable independently

---

## Phase 4: User Story 2 - Schedule not yet publicly released (Priority: P2)

**Goal**: Show pending state when schedule is not publicly released.

**Independent Test**: Access schedule page before publication and verify pending message or hidden link.

### Tests for User Story 2 (REQUIRED) ⚠️

- [ ] T022 [P] [US2] Acceptance test for AT-UC30-03 in tests/acceptance/uc30_schedule_not_available.test.js
- [ ] T023 [P] [US2] Integration test for unpublished schedule response in tests/integration/public_schedule_unpublished.test.js
- [ ] T024 [P] [US2] Unit tests for pending-state logic in tests/unit/public_schedule_pending.test.js

### Implementation for User Story 2

- [ ] T025 [US2] Show “Schedule not available yet” in src/views/public_schedule_view.js
- [ ] T026 [US2] Hide or disable schedule link pre-publication in src/views/schedule_announcement_view.js
- [ ] T027 [US2] Block schedule details when not published in src/services/public_schedule_service.js

**Checkpoint**: User Stories 1 and 2 independently functional

---

## Phase 5: User Story 3 - Publication and rendering failures (Priority: P3)

**Goal**: Handle publication failure and rendering failure with friendly public behavior and logging.

**Independent Test**: Simulate publish failure and render failure; verify public errors and logged failures.

### Tests for User Story 3 (REQUIRED) ⚠️

- [ ] T028 [P] [US3] Acceptance test for AT-UC30-04 in tests/acceptance/uc30_publication_failure.test.js
- [ ] T029 [P] [US3] Acceptance test for AT-UC30-05 in tests/acceptance/uc30_render_failure.test.js
- [ ] T030 [P] [US3] Integration test for publish-failure behavior in tests/integration/public_schedule_publish_failure.test.js
- [ ] T031 [P] [US3] Integration test for render-failure behavior in tests/integration/public_schedule_render_failure.test.js
- [ ] T032 [P] [US3] Unit tests for publication log service in tests/unit/publication_log_service.test.js

### Implementation for User Story 3

- [ ] T033 [US3] Log publication failures in src/services/publication_log_service.js
- [ ] T034 [US3] Return friendly render error in src/views/public_schedule_view.js
- [ ] T035 [US3] Prevent exposure of partial schedule on publish failure in src/services/public_schedule_service.js

**Checkpoint**: All user stories independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T036 [P] Add performance validation for 3s public page load in tests/performance/public_schedule_perf.test.js
- [ ] T037 [P] Add high-traffic timeout/loader validation in tests/integration/public_schedule_timeout.test.js
- [ ] T038 [P] Add accessibility checks for public schedule page in tests/integration/public_schedule_a11y.test.js
- [ ] T039 [P] Add log retention validation for 90-day publication/render logs in tests/integration/public_schedule_log_retention.test.js
- [ ] T040 [P] Add “Last updated” timestamp rendering in src/views/public_schedule_view.js
- [ ] T041 [P] Update quickstart verification steps in specs/030-public-final-schedule/quickstart.md

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

- Foundational model/service tasks T005–T011 can run in parallel
- Tests for each user story (T012–T016, T022–T024, T028–T032) can run in parallel
- Performance/accessibility/log retention tasks T036–T039 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Acceptance tests for AT-UC30-01/02 in tests/acceptance/uc30_*.test.js"
Task: "Integration tests for public schedule and announcement link in tests/integration/*.test.js"
Task: "Unit tests for public schedule service in tests/unit/public_schedule_service.test.js"

# Launch model/service tasks together:
Task: "Create PublicSchedule model in src/models/public_schedule.js"
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

## Traceability Map (UC-30 → S-30 → AT-30 → Tests)

- **UC-30 / S-30 / AT-UC30-01** → tests/acceptance/uc30_public_schedule_view.test.js (T012)
- **UC-30 / S-30 / AT-UC30-02** → tests/acceptance/uc30_readable_listings.test.js (T013)
- **UC-30 / S-30 / AT-UC30-03** → tests/acceptance/uc30_schedule_not_available.test.js (T022)
- **UC-30 / S-30 / AT-UC30-04** → tests/acceptance/uc30_publication_failure.test.js (T028)
- **UC-30 / S-30 / AT-UC30-05** → tests/acceptance/uc30_render_failure.test.js (T029)
