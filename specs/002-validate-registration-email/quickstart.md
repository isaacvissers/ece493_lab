# Quickstart: Validate Registration Email

**Date**: 2026-01-31
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/002-validate-registration-email/spec.md

## Goal

Verify email validation behavior (format rules, uniqueness, and failure handling)
within the registration flow.

## Prerequisites

- A modern desktop browser (Chrome, Firefox, or Edge)
- Project files available locally

## Run

1. Open `index.html` in your browser.
2. Navigate to the registration screen.
3. Submit a valid, unique email and confirm validation allows continuation.
4. Submit an invalid-format email and confirm validation blocks continuation.
5. Submit a duplicate email and confirm duplicate error is shown.
6. Open `tests/run.html` to execute unit, integration, and acceptance tests in-browser.

## Validation Checks

- Leading/trailing whitespace is trimmed before validation.
- Invalid format short-circuits uniqueness checks.
- Duplicate emails are detected case-insensitively.
- Data-store failure blocks continuation and shows a validation error.
