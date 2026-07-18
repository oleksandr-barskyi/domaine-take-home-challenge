# Domaine Product Card

Custom Shopify theme implementation for the Domaine product-card assessment. The project is built on Shopify's Skeleton Theme and adds a reusable premium product card, an assessment demo section, a variant preview grid, scoped Tailwind styling, and small JavaScript interactions for color/variant switching.

## What Is Included

- Reusable product card snippet: `snippets/domaine-product-card.liquid`
- Variant preview grid snippet: `snippets/domaine-product-variant-grid.liquid`
- Configurable demo section: `sections/domaine-product-card-demo.liquid`
- Assessment page template: `templates/page.domaine-assessment.json`
- Scoped Tailwind entrypoint: `src/tailwind.css`
- Compiled theme stylesheet: `assets/domaine.css`
- Product-card interaction script: `assets/domaine-product-card.js`
- Local demo imagery under `assets/domaine-*.jpg`

The demo section defaults to the product handle `classic-cotton-tee` and includes an optional secondary product link that defaults to `second-generic-product`. Both products can be changed in the Shopify Theme Editor.

## Implemented Features

- Variant-aware sale badge based on `compare_at_price > price`
- Current price and compare-at price display
- Product title, vendor, product link, and pricing row
- Color swatches generated from the product color/colour option
- Native Shopify swatch color support with fallback color mappings for common values
- Swatch click updates active state, primary image, secondary hover image, price, compare-at price, and sale badge
- Desktop two-image presentation with color-aware primary and secondary media selection
- Variant grid showing flat and model/secondary imagery for every variant
- Product picker and secondary product picker in the demo section
- Accessible swatch buttons with labels, `aria-pressed`, visible focus states, and no empty controls
- Responsive layout with stable image aspect ratios
- Global theme wiring for `assets/domaine.css` and deferred `assets/domaine-product-card.js`
- `.gitignore` coverage for local Shopify, IDE, release, dependency, and remote-check artifacts

## Tech Stack

- Shopify Skeleton Theme
- Shopify Liquid snippets, sections, and JSON templates
- TailwindCSS CLI
- Vanilla JavaScript
- Shopify CLI and Theme Check

## Local Setup

Install dependencies:

```bash
npm install
```

This installs the Tailwind CLI and Shopify tooling used by the local build and validation commands.

Build the compiled CSS:

```bash
npm run build:css
```

Run Tailwind in watch mode while editing:

```bash
npm run dev:css
```

Run Theme Check:

```bash
npm run check
```

Start the Shopify theme dev server:

```bash
npm run dev:shopify
```

The Shopify dev command targets:

```bash
shopify theme dev --store domain-take-home-challenge.myshopify.com
```

## Shopify Demo

The assessment template is `page.domaine-assessment`.

To preview it in Shopify:

1. Create or open a page in Shopify Admin.
2. Assign the page template `page.domaine-assessment`.
3. Open the page through the theme preview.
4. In the Theme Editor, configure the Domaine product card demo section if needed.

Default product handles:

- Primary product: `classic-cotton-tee`
- Secondary product: `second-generic-product`

For a shareable preview, push an unpublished theme:

```bash
shopify theme push --unpublished
```

Then copy the preview link from Shopify Admin > Online Store > Themes.

## Component Behavior

The product card is rendered as a snippet so it can be reused in product lists, recommendations, featured-product modules, or collection grids. The demo section is only the assessment wrapper around that reusable card.

Initial selection uses `product.selected_or_first_available_variant`. If a product has a color/colour option, the card renders one swatch per color value and associates each swatch with the first available matching variant when possible.

Image selection prefers variant featured media first. If no variant media exists, Liquid looks for product media whose alt text contains the selected color. It prefers non-model imagery for the primary image and model/worn imagery for the secondary image. If alt text is not descriptive enough, it falls back to other product media or positional matching.

JavaScript stays presentation-focused. Liquid renders the product data into `data-*` attributes, and `assets/domaine-product-card.js` only updates DOM state after swatch clicks.

## Styling

Tailwind is compiled from `src/tailwind.css` into `assets/domaine.css`. The Tailwind content paths include layouts, templates, sections, snippets, and the product-card JavaScript file.

The Domaine UI uses a `domaine-scope` class so the new component styles stay easy to identify inside the broader Shopify theme.

## QA Status

- Tailwind build command is available through `npm run build:css`
- Theme Check command is available through `npm run check`
- Product title, vendor, price, compare-at price, sale badge, swatches, image switching, and variant grid are implemented in Liquid/JS
- Browser QA should still be performed against the Shopify preview for final visual fit, hover behavior, responsive layout, and console errors

## Known Limitations

- Secondary image matching depends on product media quality. Best results require image alt text that includes the color value and describes model/worn images.
- Some branded color names may need a future color map, product metafield, or theme setting if Shopify swatches are not configured.
- The card updates presentation only. It does not add cart behavior, change selected product forms, or update the product URL variant query parameter.
- The repository does not include a committed Shopify preview URL because preview links are generated from the target Shopify store/theme.

## Future Improvements

- Add optional quick-add behavior.
- Add a theme setting or metafield-driven swatch color map.
- Add unit-level tests for JavaScript swatch updates.
- Extend the card snippet with density variants for collection grids.
- Add stricter media matching if product image naming conventions are standardized.
