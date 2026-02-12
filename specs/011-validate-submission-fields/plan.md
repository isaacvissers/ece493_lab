# Implementation Plan: Validate Paper Submission Fields

**Branch**: `011-validate-submission-fields` | **Date**: 2026-02-02 | **Spec**: /home/ivissers/ece_493/labs/lab2/lab2/specs/011-validate-submission-fields/spec.md
**Input**: Feature specification from `/specs/011-validate-submission-fields/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command.

## Summary

Implement UC-11 validation on final submit: required fields, email format, manuscript file presence, and accepted file extensions. Block submission with clear, aggregated errors; allow draft save without required-field validation but validate provided email/file formats.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES2020)  
**Primary Dependencies**: None (vanilla only)  
**Storage**: Browser localStorage + in-memory cache (simulated CMS database)  
**Testing**: Lightweight JS test harness using Node.js `assert` + DOM tests in browser  
**Target Platform**: Modern desktop browsers (Chrome/Firefox/Edge)  
**Project Type**: single (frontend-only MVC app)  
**Performance Goals**: Validation feedback <= 200 ms  
**Constraints**: MVC separation; no external UI/JS frameworks; accessibility required  
**Scale/Scope**: Authenticated authors only; submission form validation only

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- MVC architecture confirmed (models/controllers/views separated; vanilla HTML/CSS/JS only)
- Traceability defined for UC-11 -> S-11 -> AT-11 -> tests
- Required test types planned (unit for models/controllers; integration for multi-view flows)
- UX consistency checklist captured (navigation, terminology, validation, accessibility)
- Performance targets stated (<=200 ms interactions; no >50 ms main-thread tasks)

**Gate Status**: PASS

## Constitution Re-check (Post-Design)

- MVC separation preserved in planned structure
- Traceability artifacts referenced (UC-11/S-11/AT-11)
- Test coverage includes unit, integration, and acceptance layers
- UX consistency and accessibility checks included in quickstart validation
- Performance limits reflected in technical context

**Re-check Status**: PASS

## Project Structure

### Documentation (this feature)

```text
specs/011-validate-submission-fields/
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
│   ├── submission-metadata.js
│   ├── manuscript-file.js
│   └── draft-submission.js
├── controllers/
│   └── submission-validation-controller.js
├── views/
│   └── submission-form-view.js
├── services/
│   └── submission-validation.js
├── app.js
└── index.html

styles/
└── main.css

tests/
├── unit/
│   ├── submission-metadata.test.js
│   ├── manuscript-file.test.js
│   └── submission-validation.test.js
├── integration/
│   └── submission-validation-flow.test.js
└── acceptance/
    └── at-uc11.test.js
```

**Structure Decision**: Single frontend MVC app; controller handles submit/draft validation flows, models represent metadata/file/draft state, view renders form and errors, service performs validation rules.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
