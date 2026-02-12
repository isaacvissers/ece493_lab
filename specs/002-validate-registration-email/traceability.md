# Traceability Map - UC-02 Validate Registration Email

| Artifact | Reference | Notes |
|---|---|---|
| Use Case | UC-02 | Validate Registration Email |
| Scenario | S-02 | Email format + uniqueness validation |
| Acceptance Tests | AT-02 | Email validation behavior |
| Tests | tests/acceptance/at-uc02.test.js | Acceptance tests |
| Tests | tests/integration/registration-email-validation.test.js | Integration validation flow |
| Tests | tests/unit/validation-service.test.js | Email format rules |
| Tests | tests/unit/storage-service.test.js | Uniqueness + logging |
| Tests | tests/unit/registration-controller.test.js | Controller short-circuit logic |
