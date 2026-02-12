# Specification Quality Checklist: Reject Invalid Login Credentials

**Purpose**: Validate specification completeness and quality before proceeding to planning
**Created**: 2026-02-01
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/006-reject-invalid-login/spec.md

## Requirement Completeness

- [x] CHK001 Are invalid-credential outcomes explicitly documented? [Completeness, Spec §User Story 1]
- [x] CHK002 Are rejection behaviors defined for wrong password and missing user? [Completeness, Spec §FR-001–FR-002]
- [x] CHK003 Are database lookup failure behaviors specified? [Completeness, Spec §FR-005]
- [x] CHK004 Are post-failure access restrictions defined? [Completeness, Spec §FR-006]
- [x] CHK005 Are retry expectations clearly stated? [Completeness, Spec §FR-007]

## Requirement Clarity

- [x] CHK006 Is the login identifier defined unambiguously (email)? [Clarity, Spec §Assumptions & Dependencies]
- [x] CHK007 Is the generic invalid-credentials message explicitly required? [Clarity, Spec §FR-002]
- [x] CHK008 Is sensitive-message replacement clearly described? [Clarity, Spec §FR-004]
- [x] CHK009 Is “login unavailable” tied to DB lookup failure? [Clarity, Spec §FR-005]
- [x] CHK010 Are “protected pages” expectations clear post-failure? [Clarity, Spec §FR-006]

## Requirement Consistency

- [x] CHK011 Do acceptance scenarios align with functional requirements? [Consistency, Spec §Acceptance Scenarios vs §FR-001–FR-007]
- [x] CHK012 Do success criteria align with the rejection-focused requirements? [Consistency, Spec §SC-001–SC-005]
- [x] CHK013 Is logging consistently described as transient? [Consistency, Spec §Assumptions & Dependencies, §FR-004–FR-005, §Key Entities]

## Acceptance Criteria Quality

- [x] CHK014 Are success criteria measurable without implementation detail? [Acceptance Criteria, Spec §SC-001–SC-005]
- [x] CHK015 Do success criteria cover generic-error anti-enumeration? [Acceptance Criteria, Spec §SC-002, §SC-005]
- [x] CHK016 Do success criteria cover DB lookup failures? [Acceptance Criteria, Spec §SC-003]

## Scenario Coverage

- [x] CHK017 Are main invalid-credential flows covered? [Coverage, Spec §Acceptance Scenarios]
- [x] CHK018 Are alternate flows (missing user, wrong password, DB failure) covered? [Coverage, Spec §Acceptance Scenarios]
- [x] CHK019 Is anti-enumeration explicitly covered? [Coverage, Spec §Acceptance Scenarios]

## Edge Case Coverage

- [x] CHK020 Are whitespace-only submissions addressed? [Coverage, Spec §Edge Cases]
- [x] CHK021 Are repeated invalid attempts addressed (no lockout)? [Coverage, Spec §Edge Cases]

## Non-Functional Requirements

- [x] CHK022 Are performance targets quantified? [Completeness, Spec §NFR-001]
- [x] CHK023 Are accessibility requirements specified for errors? [Completeness, Spec §NFR-002]

## Dependencies & Assumptions

- [x] CHK024 Are dependencies on login page and logged-out state documented? [Dependencies, Spec §Assumptions & Dependencies]
- [x] CHK025 Are exclusions of lockout/MFA explicitly stated? [Dependencies, Spec §Assumptions & Dependencies, §Out of Scope]

## Ambiguities & Conflicts

- [x] CHK026 Are there no placeholder markers (TODO/TKTK/???)? [Gap]
- [x] CHK027 Is terminology consistent (“email” vs “username”)? [Consistency, Spec §Assumptions & Dependencies]
- [x] CHK028 Is logging scope (invalid creds + DB failure) consistent across spec? [Consistency, Spec §FR-004–FR-005]
- [x] CHK029 Is retry behavior explicit and non-conflicting with “no lockout”? [Consistency, Spec §FR-007]
- [x] CHK030 Is session handling described without contradictions? [Consistency, Spec §FR-003, §FR-006]

## Notes

- Items marked incomplete require spec updates before `/speckit.clarify` or `/speckit.plan`
