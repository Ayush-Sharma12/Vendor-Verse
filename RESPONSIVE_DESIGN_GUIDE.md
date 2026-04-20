# VendorVerse - Responsive Design Guide

## Breakpoints (Tailwind)
- `sm`: >= 640px
- `md`: >= 768px
- `lg`: >= 1024px
- `xl`: >= 1280px
- `2xl`: >= 1536px

## Principles
- Mobile-first layout with progressively enhanced spacing/typography.
- Avoid fixed widths; prefer `max-w-*`, `w-full`, and responsive grids.
- Keep touch targets comfortable on mobile (>= ~44px where possible).

## Key screens
### Browse (`src/pages/browse.tsx`)
- Vendor cards stay readable on narrow screens.
- Badges/pills wrap instead of overflowing.

### Vendor Profile (`src/pages/vendor-profile.tsx`)
- Sticky header keeps navigation available on long pages.
- Media sections use fixed aspect ratios to prevent layout shift.
