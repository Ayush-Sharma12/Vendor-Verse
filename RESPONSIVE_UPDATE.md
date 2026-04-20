# VendorVerse - Responsive Design & Image Loading Fix

## Summary
- Fixes vendor image loading by using direct, public image URLs (Unsplash-style parameters).
- Improves responsiveness for mobile, tablet, and desktop across browse + vendor profile pages.

## What changed
- `src/lib/vendorStore.ts`: vendor seed data now includes working `photo_url` values (and optional `owner_photo_url` / `shop_photo_url` where used).
- `src/pages/browse.tsx`: small UI tweaks for better card layout on small screens.
- `src/pages/vendor-profile.tsx`: layout refinements and a shareable vendor link section.

## Notes
- If you see a broken image at runtime, it usually means the source URL blocks hotlinking/CORS; swap to a public CDN image URL.
