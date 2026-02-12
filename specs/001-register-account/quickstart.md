# Quickstart: Register an Account

**Date**: 2026-01-31
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/001-register-account/spec.md

## Goal

Verify the registration flow (including validation, duplicate checks, error guidance,
retry behavior, and auto-login redirect) in a local browser run.

## Prerequisites

- A modern desktop browser (Chrome, Firefox, or Edge)
- Project files available locally

## Run

1. Open `index.html` in your browser.
2. Navigate to the registration screen.
3. Register with a new email (single “@”, local part, dot in domain) and a valid password
   (min 8 chars, includes a number and a symbol).
4. Confirm you see a success confirmation message and are auto-logged in to the dashboard.
5. Open `tests/run.html` to execute unit, integration, and acceptance tests in-browser.

## Performance Check Method

1. Open the browser devtools Performance panel.
2. Start recording, submit the registration form with valid input, then stop.
3. Confirm submit/validation/redirect work completes in <= 200 ms and no main-thread
   task exceeds 50 ms.

## Validation Checks

- Invalid email format shows an error naming the email field and providing one recovery instruction.
- Invalid password shows an error naming the password field and providing one recovery instruction.
- Duplicate email (case-insensitive) shows an email-in-use error and recovery instruction.
- Blank email or password blocks submission and identifies the missing field.
- On data-store failure, a failure message is shown and retry succeeds after recovery with no partial account.
- On success, account is created and user is signed in automatically.
- Form is keyboard operable with visible focus states and screen-reader perceivable errors.
