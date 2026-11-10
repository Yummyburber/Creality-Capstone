# Creality-Capstone

Our Capstone project: DIY Budget Meal Creator Website.

## Project Layout

- `Frontend/` contains the current homepage and recipes-page HTML.
- `styles.css` contains shared homepage, navbar, recipe, card, and dark-theme styles.
- `homepage.js`, `recipes.js`, and `theme.js` contain client-side behavior.
- `Images/` contains site artwork and page photography.
- `Documentation/` contains the maintained project documentation.

## Current Feature Status

- Homepage hero, feature cards, responsive navbar, and persistent light/dark theme are implemented.
- Homepage search redirects to the recipes page with an encoded URL query.
- Recipes page includes text, meal-type, and dietary filtering with sample fallback data.
- Recipe import and recipe detail pages remain placeholders.
- Create, pantry, and meal-plan navigation targets still require complete pages or target updates.
- Supabase integration is present but needs URL/import and query verification before it is production-ready.

## Recent Notes

- Recipe HTML and homepage HTML are being organized under `Frontend/` while shared assets and scripts remain at the project root.
- The recipes search/filter implementation has moved beyond a static hero-only page.
- The homepage now includes a persisted dark/light theme toggle.
- Homepage search parameters are accepted by the recipes filtering logic.
