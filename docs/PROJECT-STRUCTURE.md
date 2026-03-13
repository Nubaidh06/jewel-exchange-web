# Jewel Exchange Project Structure

This guide keeps day-to-day edits predictable and safe.

## Top-Level Layout

- `index.html` — Home page
- `jewelry.html` — Jewelry listing page
- `gemstones.html` — Gemstone listing page
- `bespoke.html` — Bespoke services page
- `about.html` — Brand story page
- `contact.html` — Contact and appointment page

## Styles

- `css/style.css` — CSS manifest (ordered imports only)
- `css/sections/01-core-foundation.css` — Variables, base, navigation, shared sections
- `css/sections/02-about-page.css` — About page styling
- `css/sections/03-bespoke-page.css` — Bespoke page styling
- `css/sections/04-collections-pages.css` — Jewelry + gemstone listing styles
- `css/sections/05-contact-page.css` — Contact page styles
- `css/sections/06-home-and-drawer.css` — Home sections, product card/drawer shared patterns

## JavaScript

- `js/site-config.js` — Shared runtime constants (WhatsApp, data file paths)
- `js/main.js` — Navigation, data loading, grid rendering, filtering, drawer interactions, navbar search
- `js/utilities.js` — Form validation, utility helpers, optional product helpers

## Data

- `data/products.json` — Jewelry products used by home/jewelry pages
- `data/gemstones.json` — Gemstone products used by gemstone page

## Media

- `images/` — Logos, banners, product and social images
- `videos/` — Hero/background video files

## Editing Rules (Safe Workflow)

1. Update product records in `data/*.json` first.
2. Add/replace media files under `images/` or `videos/` before changing paths.
3. Keep CSS edits inside the correct `css/sections/*` file.
4. Keep shared constants in `js/site-config.js` to avoid hardcoded duplicates.
5. After edits, run a quick route/path integrity check before shipping.
