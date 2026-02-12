# Tasks: View Conference Price List

**Input**: Design documents from `/specs/032-view-price-list/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED. Include unit tests for model/controller logic and integration/acceptance tests mapped to AT-XX.md cases.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Ensure MVC directories exist for pricing in src/models/ src/services/ src/controllers/ src/views/
- [ ] T002 [P] Add price list route placeholder in src/controllers/router.js
- [ ] T003 [P] Create price list view shell in src/views/price_list_view.js
- [ ] T004 [P] Create price list error view shell in src/views/price_list_error_view.js
- [ ] T042 [P] Add CMS navigation entry linking to Price List in src/views/navigation_view.js (or existing nav view)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 [P] Create PriceList model in src/models/price_list.js
- [ ] T006 [P] Create PriceItem model in src/models/price_item.js
- [ ] T007 [P] Create PricingPolicy model in src/models/pricing_policy.js
- [ ] T008 [P] Create PriceListLog model in src/models/price_list_log.js
- [ ] T009 [P] Implement price list retrieval service in src/services/price_list_service.js
- [ ] T010 [P] Implement access policy service in src/services/pricing_policy_service.js (read localStorage key `pricingPolicy`)
- [ ] T011 [P] Implement price list logging helper in src/services/price_list_log_service.js
- [ ] T043 [P] Enforce allowed pricing categories in src/models/price_item.js
- [ ] T044 [P] Implement log retention (90 days) in src/services/price_list_log_service.js

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View published price list (Priority: P1) 🎯 MVP

**Goal**: Show published pricing clearly to guests and registered users.

**Independent Test**: Open Price List page for a conference with published prices and verify display.

### Tests for User Story 1 (REQUIRED) ⚠️

- [ ] T012 [P] [US1] Acceptance test for AT-UC32-01 in tests/acceptance/uc32_guest_view_prices.test.js
- [ ] T013 [P] [US1] Acceptance test for AT-UC32-02 in tests/acceptance/uc32_registered_view_prices.test.js
- [ ] T014 [P] [US1] Integration test for price list retrieval in tests/integration/price_list_retrieval.test.js
- [ ] T015 [P] [US1] Unit tests for price list mapping/formatting (USD/en-US) in tests/unit/price_list_service.test.js

### Implementation for User Story 1

- [ ] T016 [P] [US1] Render price list table (Category/Label, Rate Type, Amount) with USD/en-US formatting in src/views/price_list_view.js
- [ ] T017 [US1] Implement price list controller action in src/controllers/price_list_controller.js
- [ ] T018 [US1] Wire price list route in src/controllers/router.js
- [ ] T019 [US1] Load published price list in src/services/price_list_service.js

**Checkpoint**: User Story 1 fully functional and testable independently

---

## Phase 4: User Story 2 - Handle missing or incomplete price lists (Priority: P2)

**Goal**: Show “not available” and TBD handling for missing/invalid data.

**Independent Test**: Open Price List for unpublished list and list with missing items.

### Tests for User Story 2 (REQUIRED) ⚠️

- [ ] T020 [P] [US2] Acceptance test for AT-UC32-03 in tests/acceptance/uc32_price_list_unavailable.test.js
- [ ] T021 [P] [US2] Acceptance test for AT-UC32-04 in tests/acceptance/uc32_price_list_tbd_items.test.js
- [ ] T022 [P] [US2] Integration test for data-quality handling in tests/integration/price_list_data_quality.test.js
- [ ] T023 [P] [US2] Unit tests for missing/invalid item labeling and allowed category validation in tests/unit/price_item_validation.test.js

### Implementation for User Story 2

- [ ] T024 [US2] Render “Price list not available yet” state in src/views/price_list_view.js
- [ ] T025 [US2] Label missing items as "TBD" by default and omit only when policy enables in src/services/price_list_service.js
- [ ] T026 [US2] Log data-quality issues in src/services/price_list_log_service.js

**Checkpoint**: User Stories 1 and 2 independently functional

---

## Phase 5: User Story 3 - Access control and failure handling (Priority: P3)

**Goal**: Enforce access restriction, show friendly errors, and handle timeouts/slow loads.

**Independent Test**: Enforce restricted policy, simulate render failure, and simulate high traffic.

### Tests for User Story 3 (REQUIRED) ⚠️

- [ ] T027 [P] [US3] Acceptance test for AT-UC32-05 (includes retry cue) in tests/acceptance/uc32_render_failure.test.js
- [ ] T028 [P] [US3] Acceptance test for AT-UC32-06 in tests/acceptance/uc32_access_restricted.test.js
- [ ] T029 [P] [US3] Acceptance test for AT-UC32-07 in tests/acceptance/uc32_high_traffic_timeout.test.js
- [ ] T030 [P] [US3] Integration test for access policy enforcement in tests/integration/price_list_access_policy.test.js
- [ ] T031 [P] [US3] Unit tests for timeout/loader behavior in tests/unit/price_list_timeout.test.js

### Implementation for User Story 3

- [ ] T032 [US3] Enforce access policy in src/services/pricing_policy_service.js
- [ ] T033 [US3] Show access message or redirect in src/controllers/price_list_controller.js
- [ ] T034 [US3] Show friendly error message in src/views/price_list_error_view.js
- [ ] T035 [US3] Show loading indicator and timeout message in src/views/price_list_view.js
- [ ] T036 [US3] Log render failures and timeouts in src/services/price_list_log_service.js
- [ ] T037 [US3] Ensure guests cannot initiate registration from price list view in src/controllers/price_list_controller.js

**Checkpoint**: All user stories independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T038 [P] Add performance validation for 200 ms interaction target in tests/performance/price_list_perf.test.js
- [ ] T039 [P] Add accessibility checks for price list page in tests/integration/price_list_a11y.test.js
- [ ] T040 [P] Add log retention validation for 90-day price list logs in tests/integration/price_list_log_retention.test.js
- [ ] T041 [P] Update quickstart verification steps in specs/032-view-price-list/quickstart.md
- [ ] T045 [P] Add long-task validation for <=50 ms main-thread work in tests/performance/price_list_long_task.test.js
- [ ] T046 [P] Add end-to-end view completion timing test for 2s target in tests/performance/price_list_view_timing.test.js

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
- Tests for each user story (T012–T015, T020–T023, T027–T031) can run in parallel
- Performance/accessibility/log retention tasks T038–T040 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Acceptance tests for AT-UC32-01/02 in tests/acceptance/uc32_*.test.js"
Task: "Integration test for price list retrieval in tests/integration/price_list_retrieval.test.js"
Task: "Unit tests for price list mapping/formatting in tests/unit/price_list_service.test.js"

# Launch model/service tasks together:
Task: "Create PriceList model in src/models/price_list.js"
Task: "Create PriceItem model in src/models/price_item.js"
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

## Traceability Map (UC-32 → S-32 → AT-32 → Tests)

- **UC-32 / S-32 / AT-UC32-01** → tests/acceptance/uc32_guest_view_prices.test.js (T012)
- **UC-32 / S-32 / AT-UC32-02** → tests/acceptance/uc32_registered_view_prices.test.js (T013)
- **UC-32 / S-32 / AT-UC32-03** → tests/acceptance/uc32_price_list_unavailable.test.js (T020)
- **UC-32 / S-32 / AT-UC32-04** → tests/acceptance/uc32_price_list_tbd_items.test.js (T021)
- **UC-32 / S-32 / AT-UC32-05** → tests/acceptance/uc32_render_failure.test.js (T027)
- **UC-32 / S-32 / AT-UC32-06** → tests/acceptance/uc32_access_restricted.test.js (T028)
- **UC-32 / S-32 / AT-UC32-07** → tests/acceptance/uc32_high_traffic_timeout.test.js (T029)
