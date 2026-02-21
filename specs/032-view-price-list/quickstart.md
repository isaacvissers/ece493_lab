# Quickstart: View Conference Price List

## Goal
Run and validate the Price List page for UC-32.

## Prerequisites
- Node/npm installed
- Project dependencies installed

## Run
1. Start the app server.
2. Open the CMS webpage.
3. Navigate to the **Price List** page.

## Verification
- With a published price list, prices display clearly.
- With no published price list, "Price list not available yet" is shown.
- With missing items, labels show "TBD".
- Prices use USD formatting with "$" and en-US formatting.
- Access restriction (if enabled) blocks guests with an access message.
- Rendering failure displays a friendly error.
- Under load, a loading indicator appears; timeout shows a friendly message.
