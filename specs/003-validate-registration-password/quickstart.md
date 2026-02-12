# Quickstart: Validate Registration Password

**Date**: 2026-01-31
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/003-validate-registration-password/spec.md

## Goal

Verify password validation behavior (policy retrieval, failure handling, and compliance checks)
within the registration flow.

## Prerequisites

- A modern desktop browser (Chrome, Firefox, or Edge)
- Project files available locally

## Run

1. Open `index.html` in your browser.
2. Navigate to the registration screen.
3. Submit a compliant password and confirm validation allows continuation.
4. Submit too-short, complexity-violating, and disallowed-content passwords and confirm
   validation blocks continuation with correct errors.
5. Open `tests/run.html` to execute unit, integration, and acceptance tests in-browser.

## Validation Checks

- Policy retrieval occurs before validation.
- Too-short, complexity, and disallowed-content passwords are rejected with clear errors.
- Policy retrieval failure blocks continuation and logs the failure.
- No account/password state is changed when validation fails.
