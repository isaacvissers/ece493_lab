# Data Model: View Conference Price List

## Entities

### PriceList
- **id**
- **conferenceId**
- **status**: published | unpublished
- **items**: [PriceItem]
- **lastUpdatedAt**

### PriceItem
- **id**
- **priceListId**
- **category**: student | professional | early-bird | workshop
- **label**: string
- **amount**: number | null
- **status**: valid | tbd | invalid

### PricingPolicy
- **accessLevel**: public | registered_only
- **missingItemDisplay**: tbd | omit

### PriceListLog
- **id**
- **priceListId**
- **event**: data_quality_issue | render_failure | timeout
- **timestamp**
- **message**

## Relationships

- PriceList **has many** PriceItem
- PriceList **has one** PricingPolicy
- PriceListLog **records** issues for a PriceList

## Validation Rules

- Published price list must be retrievable for display.
- Missing or invalid items are labeled as TBD by default; policy may omit.
- Prices are displayed in USD using "$" and en-US number formatting.
- Access policy determines whether guest viewing is allowed.
- Rendering failures and data-quality issues are logged.

## State Transitions

- unpublished → published
- published → unpublished
