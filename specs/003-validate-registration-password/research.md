# Research: Validate Registration Password

**Date**: 2026-01-31
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/003-validate-registration-password/spec.md

## Decisions

### Password policy
- **Decision**: Minimum 8 characters with at least one number and one symbol.
- **Rationale**: Aligns with clarified spec and UC-01 baseline while keeping friction low.
- **Alternatives considered**:
  - Minimum length only
  - 12+ characters with upper/lower/number/symbol

### Policy source
- **Decision**: Static policy hardcoded in the application for this feature.
- **Rationale**: No external policy service or data model required.
- **Alternatives considered**:
  - Configurable policy service

### Failure handling
- **Decision**: Fail safe on policy retrieval failure, log the failure, allow retry after recovery.
- **Rationale**: Matches UC-03 failure path and acceptance tests.
- **Alternatives considered**:
  - Allow validation with cached/default policy

### Testing approach
- **Decision**: Lightweight JS test harness with Node.js `assert` and browser-based integration/acceptance tests.
- **Rationale**: No external dependencies; aligns with project constraints.
- **Alternatives considered**:
  - Full testing framework
