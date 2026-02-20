# Tasks: Receive Editor’s Decision

**Input**: Design documents from `/specs/025-author-decision/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED. Include unit tests for model/controller logic and integration/acceptance tests mapped to AT-UC25 cases.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create decision feature storage helpers in `src/services/storage.js`
- [x] T002 [P] Add decision layout container markup in `src/views/decision_layout.html`
- [x] T003 [P] Add decision/notification styles in `src/views/decision.css`
- [x] T004 Register decision routes in `src/controllers/router.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Implement auth/session guard utility in `src/services/auth_service.js`
- [x] T006 [P] Implement Paper model in `src/models/paper.js`
- [x] T007 [P] Implement Author model with notification settings in `src/models/author.js`
- [x] T008 Implement Decision model in `src/models/decision.js`
- [x] T009 Implement decision repository in `src/services/decision_repository.js`
- [x] T010 Implement access control helper in `src/services/access_control.js`
- [x] T011 Implement audit log service in `src/services/audit_log_service.js`
- [x] T012 Implement notification preference storage in `src/services/notification_prefs.js`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Author views decision in CMS (Priority: P1) 🎯 MVP

**Goal**: Authors can view released decisions (and optional notes) in My Submissions.

**Independent Test**: Login as submitting author; open decided paper and verify decision/notes shown.

### Tests for User Story 1 (REQUIRED) ⚠️

- [x] T013 [P] [US1] Acceptance test for decision view (AT-UC25-01) in `tests/acceptance/test_decision_view.js`
- [x] T014 [P] [US1] Acceptance test for login redirect (AT-UC25-05) in `tests/acceptance/test_decision_auth.js`
- [x] T015 [P] [US1] Integration test for decision detail view in `tests/integration/test_decision_view.js`
- [x] T016 [P] [US1] Unit tests for decision repository mapping in `tests/unit/test_decision_repository.js`

### Implementation for User Story 1

- [x] T017 [P] [US1] Implement decision list view in `src/views/decision_list_view.js`
- [x] T018 [P] [US1] Implement decision detail view in `src/views/decision_detail_view.js`
- [x] T019 [US1] Implement decision page controller in `src/controllers/decision_controller.js`
- [x] T020 [US1] Add notes rendering rules in `src/views/decision_detail_view.js`
- [x] T021 [US1] Wire My Submissions navigation to decision controller in `src/controllers/router.js`

**Checkpoint**: User Story 1 fully functional and testable independently

---

## Phase 4: User Story 2 - Author receives notifications when enabled (Priority: P2)

**Goal**: Authors receive notifications through enabled channels; disabled channels suppress notifications.

**Independent Test**: Enable notifications, release decision, verify delivery and failure fallback handling.

### Tests for User Story 2 (REQUIRED) ⚠️

- [x] T022 [P] [US2] Acceptance test for notification delivery (AT-UC25-02) in `tests/acceptance/test_notifications.js`
- [x] T023 [P] [US2] Acceptance test for notification failure fallback (AT-UC25-03) in `tests/acceptance/test_notification_failures.js`
- [x] T024 [P] [US2] Acceptance test for invalid email fallback (AT-UC25-04) in `tests/acceptance/test_notification_invalid_email.js`
- [x] T025 [P] [US2] Acceptance test for disabled channels (AT-UC25-09) in `tests/acceptance/test_notification_disabled.js`
- [x] T026 [P] [US2] Integration test for release → notify flow in `tests/integration/test_decision_release_notify.js`
- [x] T027 [P] [US2] Unit tests for notification service in `tests/unit/test_notification_service.js`

### Implementation for User Story 2

- [x] T028 [P] [US2] Implement Notification model in `src/models/notification.js`
- [x] T029 [US2] Implement notification delivery service in `src/services/notification_service.js`
- [x] T030 [US2] Implement notification settings UI in `src/views/notification_settings_view.js`
- [x] T031 [US2] Implement notification settings controller in `src/controllers/notification_settings_controller.js`
- [x] T032 [US2] Add in-app notification rendering in `src/views/notification_inbox_view.js`

**Checkpoint**: User Stories 1 AND 2 work independently

---

## Phase 5: User Story 3 - Access control and staged release (Priority: P3)

**Goal**: Enforce access control and staged release timing without early exposure.

**Independent Test**: Attempt access as non-author; stage release and verify pending state.

### Tests for User Story 3 (REQUIRED) ⚠️

- [x] T033 [P] [US3] Acceptance test for non-author access (AT-UC25-06) in `tests/acceptance/test_access_control.js`
- [x] T034 [P] [US3] Acceptance test for staged release pending state (AT-UC25-07) in `tests/acceptance/test_staged_release.js`
- [x] T035 [P] [US3] Acceptance test for notes absent (AT-UC25-08) in `tests/acceptance/test_notes_absent.js`
- [x] T036 [P] [US3] Integration test for staged release timing in `tests/integration/test_release_timing.js`
- [x] T037 [P] [US3] Unit tests for access control in `tests/unit/test_access_control.js`
- [x] T038 [P] [US3] Contract test for decision release endpoint in `tests/integration/test_decision_release_contract.js`

### Implementation for User Story 3

- [x] T039 [P] [US3] Implement AuditLog model in `src/models/audit_log.js`
- [x] T040 [US3] Implement release scheduler in `src/services/release_scheduler.js`
- [x] T041 [US3] Implement decision release controller action in `src/controllers/decision_release_controller.js`
- [x] T042 [US3] Enforce staged release in decision repository in `src/services/decision_repository.js`
- [x] T043 [US3] Log access denied and notification failures in `src/services/audit_log_service.js`

**Checkpoint**: All user stories independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T044 [P] Update user-facing copy for pending/decision states in `src/views/decision_detail_view.js`
- [x] T045 [P] Add accessibility attributes for decision and notification UI in `src/views/decision_detail_view.js`
- [ ] T046 Run quickstart validation steps from `specs/025-author-decision/quickstart.md`
- [x] T047 [P] Add release-time UI refresh timer and 1-minute validation in `src/controllers/decision_controller.js`
- [x] T048 [P] Implement audit log retention pruning in `src/services/audit_log_service.js`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with release and notification services but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Enforces access control and staged release used by US1/US2

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Models before services
- Services before controllers
- Controllers before views
- Story complete before moving to next priority

### Parallel Opportunities

- Setup tasks T002–T003 can run in parallel
- Foundational model tasks T006–T008 can run in parallel
- US1 tests (T013–T016) can run in parallel
- US2 tests (T022–T027) can run in parallel
- US3 tests (T033–T038) can run in parallel
