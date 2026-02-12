# Implementation Plan: Assign Referees to Submitted Papers

**Branch**: `013-assign-referees` | **Date**: 2026-02-02 | **Spec**: /home/ivissers/ece_493/labs/lab2/lab2/specs/013-assign-referees/spec.md
**Input**: Feature specification from `/specs/013-assign-referees/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command.

## Summary

Implement UC-13 referee assignment: editors assign exactly three unique referees by email to eligible submitted papers, validate inputs, persist assignments atomically, send required notifications, and handle auth/eligibility/notification failures gracefully.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES2020)  
**Primary Dependencies**: None (vanilla only)  
**Storage**: Browser localStorage + in-memory cache (simulated CMS database)  
**Testing**: Lightweight JS test harness using Node.js `assert` + DOM tests in browser  
**Target Platform**: Modern desktop browsers (Chrome/Firefox/Edge)  
**Project Type**: single (frontend-only MVC app)  
**Performance Goals**: Assignment confirmation <= 200 ms  
**Constraints**: MVC separation; no external UI/JS frameworks; accessibility required; <=50 ms main-thread tasks  
**Scale/Scope**: Editors only; eligible submitted papers; exactly three referees; notifications required

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- MVC architecture confirmed (models/controllers/views separated; vanilla HTML/CSS/JS only)
- Traceability defined for UC-13 -> S-13 -> AT-13 -> tests
- Required test types planned (unit for models/controllers; integration for multi-view flows)
- UX consistency checklist captured (navigation, terminology, validation, accessibility)
- Performance targets stated (<=200 ms interactions; no >50 ms main-thread tasks)

**Gate Status**: PASS

## Constitution Re-check (Post-Design)

- MVC separation preserved in planned structure
- Traceability artifacts referenced (UC-13/S-13/AT-13)
- Test coverage includes unit, integration, and acceptance layers
- UX consistency and accessibility checks included in quickstart validation
- Performance limits reflected in technical context

**Re-check Status**: PASS

## Project Structure

### Documentation (this feature)

```text
specs/013-assign-referees/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── models/
│   ├── paper.js
│   ├── referee-assignment.js
│   └── notification-log.js
├── controllers/
│   └── referee-assignment-controller.js
├── views/
│   └── referee-assignment-view.js
├── services/
│   ├── assignment-storage.js
│   ├── notification-service.js
│   └── assignment-error-log.js
├── app.js
└── index.html

styles/
└── main.css

tests/
├── unit/
│   ├── referee-assignment.test.js
│   ├── notification-log.test.js
│   └── assignment-storage.test.js
├── integration/
│   └── referee-assignment-flow.test.js
└── acceptance/
    └── at-uc13.test.js
```

**Structure Decision**: Single frontend MVC app; controller manages assignment flow, models represent paper and assignment state, view renders assignment form and messages, services handle storage, notification dispatch, and transient error logging.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
