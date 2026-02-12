# Traceability: UC-06 Reject Invalid Login Credentials

- **Use Case**: `lab1_files/UC-06.md`
- **Scenarios**: `lab1_files/S-06.md`
- **Acceptance Tests**: `lab1_files/AT-06.md`

## Mapping

| Use Case | Scenario | Acceptance Test | Implementation | Tests |
| --- | --- | --- | --- | --- |
| UC-06 | S-06 | AT-06 | Login controller invalid-credential handling + logging | `tests/acceptance/at-uc06.test.js` |
| UC-06 | S-06 | AT-06 | Invalid login integration flow | `tests/integration/invalid-login-flow.test.js` |
| UC-06 | S-06 | AT-06 | Login controller rejection logic | `tests/unit/login-controller.test.js` |
| UC-06 | S-06 | AT-06 | Session state no-auth behavior | `tests/unit/session-state.test.js` |
