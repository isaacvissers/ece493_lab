# Quickstart: Assign Referees to Submitted Papers

## Goal
Verify UC-13 assignment flow, validation, and notification behavior.

## Preconditions
- User is authenticated as Editor.
- At least one paper is in Submitted status.

## Scenarios
1. **Assign referees (happy path)**: Open a Submitted paper, enter exactly three valid, unique emails, submit; confirm assignments saved and notifications sent.
2. **Non-editor blocked**: Attempt assignment as non-editor; confirm access denied or redirected.
3. **Ineligible paper**: Attempt assignment on withdrawn/ineligible paper; confirm action blocked with message.
4. **Blank email**: Leave an email blank; confirm validation error and no assignments saved.
5. **Invalid email**: Enter invalid email format; confirm validation error and no assignments saved.
6. **Duplicate email**: Enter a duplicate email; confirm duplication handled and assignment blocked if count != 3.
7. **Already assigned**: Re-enter an already assigned email; confirm duplicate not created and assignment blocked if count != 3.
8. **Wrong count**: Provide fewer or more than three emails; confirm submission blocked with clear message.
9. **Save failure**: Simulate storage failure; confirm no partial assignments and error shown.
10. **Notification failure**: Simulate notification failure; confirm assignments saved and warning shown.
