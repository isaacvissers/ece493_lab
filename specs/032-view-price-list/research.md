# Research: View Conference Price List (UC-32)

## Decision 1: Pricing visibility default
- **Decision**: Price List page is public by default; optional restriction to registered users supported.
- **Rationale**: UC-32 targets guest and registered users; public pricing reduces friction.
- **Alternatives considered**: Registered-only by default (rejected due to lower discoverability).

## Decision 2: Missing price item handling
- **Decision**: Show missing items as "TBD" by default; policy may allow omission.
- **Rationale**: Preserves layout clarity and signals incomplete data without hiding context.
- **Alternatives considered**: Hide missing items entirely (rejected due to reduced transparency).

## Decision 3: Guest view-only behavior
- **Decision**: Guests can view pricing but cannot initiate registration from the Price List page.
- **Rationale**: Aligns with separation of pricing review vs registration flow; avoids guest action confusion.
- **Alternatives considered**: Allow guest registration from pricing page (rejected due to policy requirement).
