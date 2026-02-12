# Feature Specification: View Conference Price List

**Feature Branch**: `032-view-price-list`  
**Created**: 2026-02-04  
**Status**: Draft  
**Input**: User description: "UC-32 make sure to name branch 032-<short-name> with an appropriate name"

## Clarifications

### Session 2026-02-04

- Q: What is the default access policy for the Price List page? → A: Public (guests and registered users can view)
- Q: How should missing price items be displayed by default? → A: Show missing items as "TBD"
- Q: Should guests be able to register from the Price List page? → A: Guests can view but cannot register from the Price List page

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View published price list (Priority: P1)

As a guest or registered user, I can view the published conference price list so I can understand costs before paying.

**Why this priority**: This is the primary goal of UC-32 and enables informed registration decisions.

**Independent Test**: Can be tested by opening the Price List page for a conference with a published price list.

**Acceptance Scenarios**:

1. **Given** a published price list is available and guest access is allowed, **When** a guest opens the Price List page, **Then** the published prices are displayed clearly. (Trace: UC-32 Main, S-32 Main, AT-UC32-01)
2. **Given** a published price list is available, **When** a registered user opens the Price List page, **Then** the published prices are displayed clearly. (Trace: UC-32 Main, S-32 Main, AT-UC32-02)

---

### User Story 2 - Handle missing or incomplete price lists (Priority: P2)

As a guest or registered user, I receive clear messaging when pricing is unavailable or incomplete so I am not misled by stale or partial data.

**Why this priority**: Prevents users from acting on missing or invalid pricing and reduces confusion.

**Independent Test**: Can be tested by opening the Price List page for a conference with no published list or incomplete entries.

**Acceptance Scenarios**:

1. **Given** no published price list exists, **When** a user opens the Price List page, **Then** a "Price list not available yet" message is shown and no outdated prices are displayed. (Trace: UC-32 2a, S-32 2a, AT-UC32-03)
2. **Given** a price list has missing or invalid entries, **When** a user opens the Price List page, **Then** valid prices display and missing items are labeled "TBD" (or hidden per policy) without breaking readability. (Trace: UC-32 3a, S-32 3a, AT-UC32-04)

---

### User Story 3 - Access control and failure handling (Priority: P3)

As a guest or registered user, I get safe, clear feedback when access is restricted, rendering fails, or the page is slow to load.

**Why this priority**: Protects user experience and security under policy restrictions or operational failures.

**Independent Test**: Can be tested by enforcing access restriction, simulating a render error, and simulating high traffic.

**Acceptance Scenarios**:

1. **Given** a rendering failure occurs, **When** a user opens the Price List page, **Then** a friendly error message is shown without exposing internal details. (Trace: UC-32 4a, S-32 4a, AT-UC32-05)
2. **Given** pricing access is restricted to registered users, **When** a guest opens the Price List page, **Then** they are redirected to login or shown an access message; after login, pricing is shown. (Trace: UC-32 2b, S-32 2b, AT-UC32-06)
3. **Given** high traffic slows the page, **When** a user opens the Price List page, **Then** a loading indicator appears and the page either loads within acceptable time or shows a timeout message. (Trace: UC-32 1a, S-32 1a, AT-UC32-07)

---

### Edge Cases

- Price list is not published yet.
- Price list has missing or invalid entries.
- Rendering failure occurs while generating the page.
- Access is restricted and guest users attempt to view pricing.
- High traffic causes slow load or timeout.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a Price List page accessible from the CMS webpage.
- **FR-002**: The system MUST retrieve the current published price list for the selected conference.
- **FR-003**: The Price List page MUST present pricing in a table with headers for Category/Label, Rate Type (if applicable), and Amount, with labels left-aligned and amounts right-aligned for scanability.
- **FR-004**: When no published price list exists, the system MUST display a "Price list not available yet" message and MUST NOT show outdated pricing.
- **FR-005**: When price list entries are missing or invalid, the system MUST display valid prices and label missing entries as "TBD" by default without breaking the page layout. Omission is disabled by default; when enabled by policy, missing entries are omitted without collapsing the table headers.
- **FR-006**: The system MUST log pricing data issues when missing or invalid entries are detected.
- **FR-007**: On rendering failures, the system MUST display a friendly error message and MUST NOT expose internal error details.
- **FR-007a**: Friendly error messages MUST include a brief cause-agnostic statement and a retry cue (e.g., "Pricing cannot be displayed right now. Please try again.").
- **FR-008**: The system MUST log rendering failures for administrator review.
- **FR-009**: The Price List page MUST be public by default and MUST support a configurable policy to restrict access to registered users if needed.
- **FR-010**: When access is restricted, the system MUST redirect guests to login or show an access message before displaying pricing.
- **FR-011**: The system MUST show a loading indicator while the price list is being retrieved and rendered.
- **FR-012**: If loading exceeds 2 seconds, the system MUST show a timeout message and log the performance issue.
- **FR-013**: The Price List page MUST be view-only and MUST NOT allow guests to initiate registration from that page.
- **FR-014**: The system MUST display prices in USD using the "$" symbol and en-US number formatting.
- **FR-015**: Supported pricing categories MUST be drawn from the configured list for the conference and limited to: student, professional, early-bird, and workshop (if applicable).

### Key Entities *(include if feature involves data)*

- **PriceList**: The published pricing list for a conference.
- **PriceItem**: A pricing entry (category, label, amount, and status).
- **PricingPolicy**: Access rule indicating whether pricing is public or registered-only.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of price list views complete in under 2 seconds.
- **SC-002**: 100% of unpublished price list views show the "not available" message.
- **SC-003**: 100% of rendering failures display a friendly error without internal details.
- **SC-004**: 95% of users can view the published price list without retries.

## Assumptions

- Conferences may have different pricing categories configured by administrators.
- Pricing categories are limited to student, professional, early-bird, and workshop (if applicable).
- Pricing visibility is public by default and may be configured to require login.
- Pricing policy configuration is stored in localStorage under `pricingPolicy` with values `public` or `registered`, and cached in memory for the session.
- Logging is available for data-quality, rendering, and performance issues.

## Non-Functional Requirements

- **NFR-001**: Price List page interactions MUST respond within 200 ms.
- **NFR-002**: The Price List page MUST be keyboard operable, use semantic HTML, and show visible focus states.
- **NFR-003**: Pricing data-quality issues and rendering failures MUST be retained in logs for at least 90 days.
