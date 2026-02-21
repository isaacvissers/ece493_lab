# Quickstart: Conference Registration for Authorized Users

## Prerequisites
- Node.js and npm installed

## Run
1. Start the CMS app
2. Open the Conference Registration page
3. Submit a valid registration during an open window

## Verify
- Registration succeeds and user is marked Registered
- Duplicate registration attempts show current status
- “Registration closed” appears when the window is closed
- Window start/end dates are displayed on the registration page
- Confirmation notification is sent (in-app and/or email)
- Payment failure shows retry option and does not mark Registered
- Save/notification failures are logged without marking Registered
