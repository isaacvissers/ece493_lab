# Traceability: UC-05 Log in to CMS

- **Use Case**: `lab1_files/UC-05.md`
- **Scenarios**: `lab1_files/S-05.md`
- **Acceptance Tests**: `lab1_files/AT-05.md`

## Mapping

| Use Case | Scenario | Acceptance Test | Implementation | Tests |
| --- | --- | --- | --- | --- |
| UC-05 | S-05 | AT-05 | Login MVC (controller/view), session state, storage lookup, login logging | `tests/acceptance/at-uc05.test.js` |
| UC-05 | S-05 | AT-05 | Login controller validation + auth | `tests/unit/login-controller.test.js` |
| UC-05 | S-05 | AT-05 | Login integration flow | `tests/integration/login-flow.test.js` |
| UC-05 | S-05 | AT-05 | Session/auth state | `tests/unit/session-state.test.js` |
