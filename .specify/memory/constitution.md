<!-- Sync Impact Report
Version change: 1.0.1 -> 1.1.0
Modified principles: None
Added sections: None
Removed sections: None
Templates requiring updates: ✅ .specify/templates/plan-template.md,
✅ .specify/templates/spec-template.md, ✅ .specify/templates/tasks-template.md,
⚠ .specify/templates/commands/ (directory missing; unable to validate)
Follow-up TODOs: TODO(RATIFICATION_DATE): original adoption date unknown
-->
# CMS App Constitution

## Core Principles

### I. Code Quality & Maintainability (MVC Purity)
All implementation MUST follow MVC using vanilla HTML, CSS, and JavaScript only.
Models MUST contain business logic and data state with no DOM access. Views MUST be
presentation-only and use semantic HTML/CSS. Controllers MUST be the only layer that
handles user input and wires models to views. No framework or library may replace MVC
responsibilities. Code MUST be readable, single-purpose, and free of dead or duplicated
logic. Rationale: consistent separation lowers defects and keeps the app teachable.

### II. Testing Standards & Traceability (NON-NEGOTIABLE)
Every feature MUST trace to the lab1_files artifacts: use cases (UC-XX.md), scenarios
(S-XX.md), and acceptance tests (AT-XX.md). Each acceptance test MUST have a corresponding
automated or manual test case, and all AT-XX cases MUST pass before a feature is done.
Unit tests are REQUIRED for model and controller logic; integration tests are REQUIRED
for user flows spanning multiple views. Rationale: traceability ensures coverage of
required behavior and prevents regressions.

### III. User Experience Consistency
All screens MUST use consistent navigation patterns, terminology, layout spacing, and
visual hierarchy. Form validation and error messaging MUST be consistent across views
and must clearly indicate recovery steps. Accessibility is REQUIRED: semantic HTML,
keyboard operability, and visible focus states are mandatory. Rationale: a consistent
experience reduces user confusion and improves task completion rates.

### IV. Performance Requirements
Interactive actions (clicks, form submissions, navigation) MUST respond within 200 ms
on a typical development laptop. No single main-thread task may exceed 50 ms; long work
MUST be chunked or deferred. DOM updates MUST be batched to avoid layout thrashing, and
unnecessary re-rendering is forbidden. Rationale: predictable responsiveness keeps the
CMS usable at scale and prevents UX regressions.

## Project Constraints

- Source artifacts are stored in `lab1_files/`:
  - Use cases: `UC-XX.md`
  - Scenarios: `S-XX.md`
  - Acceptance tests: `AT-XX.md`
- Implementation MUST use MVC and vanilla HTML/CSS/JavaScript only.
- JavaScript MUST follow `style_guide.md` (Google JavaScript Style Guide).
- No external UI or JS frameworks are permitted unless explicitly approved in an amendment.

## Development Workflow & Quality Gates

- Constitution compliance MUST be checked at plan, spec, and task creation.
- Each feature MUST include a traceability map from UC-XX -> S-XX -> AT-XX -> tests.
- Code review MUST verify MVC separation, test coverage, UX consistency, and performance
  constraints, plus `style_guide.md` compliance, before merge.
- Performance checks (interactive latency and long-task limits) MUST be validated for
  each feature before completion.

## Governance

This constitution supersedes all other project guidance. Amendments require:
1) a documented rationale, 2) a version bump following semantic versioning, and
3) a migration plan if behavior or process changes. All reviews MUST include a
constitution compliance check, and any deviation MUST be recorded with justification.
Versioning policy: MAJOR for breaking governance changes, MINOR for added/expanded
principles, PATCH for clarifications or wording fixes.

**Version**: 1.1.0 | **Ratified**: TODO(RATIFICATION_DATE): original adoption date unknown | **Last Amended**: 2026-02-11
