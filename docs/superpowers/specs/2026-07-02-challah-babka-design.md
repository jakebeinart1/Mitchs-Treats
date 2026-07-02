# Challah & Babka Page — Design Spec
_Mitch's Treats · 2026-07-02_

## Overview

A new year-round ordering page for Challah Buns and Chocolate Babka. Unlike the holiday pages, this page is always active and never enters an "orders closed" state. Orders must be placed a day in advance; same-day availability requires a phone call.

---

## Files to Create / Modify

| Action | File |
|---|---|
| Create | `challah.html` |
| Create | `scripts/products-challah.js` |
| Modify | `styles/main.css` — add `theme-challah` |
| Modify | `server/server.js` — add `/challah` route |
| Modify | `index.html` — add Challah & Babka card (active) |
| Modify | All `.html` navbars — add "Challah & Babka" nav link |

---

## Theme

CSS class: `theme-challah`

Color palette: warm golden/honey tones with warm brown accents — evokes fresh bread crust and braided dough. Primary color: `#c8860a` (golden amber). Background tint: `#fdf8f0` (warm cream). Accent: `#8b5e1a` (dark bread-crust brown).

---

## Product Catalog (`scripts/products-challah.js`)

### 1. Challah Buns
- **Price:** $2.00 each
- **Min quantity:** 6
- **Quantity options:** 6–48 (increments of 1)
- **Topping options (flavor):** Plain, ET, Sesame, Assorted
- **All same price** — no `flavorPrices` needed
- **Allergen:** All parve
- **Images:** `images/challah pics/image0.jpeg` through `image7.jpeg` (cycle)

### 2. Filled Challah Buns
- **Price:** $2.50 each
- **Min quantity:** 6
- **Quantity options:** 6–48
- **Filling options (flavor):**
  - Cream Cheese & Green Olives _(dairy)_
  - Boursin _(dairy)_
  - Nutella _(dairy, contains nuts)_
  - Pizza _(dairy)_
  - Pesto _(contains nuts)_
  - Chocolate Milk _(parve)_
  - Assorted
- **All same price** — no `flavorPrices` needed
- **Images:** same challah image set

### 3. Challah Bites
- **Price:** $12.00 per dozen
- **Min quantity:** 1 dozen
- **Quantity options:** 1–10 (dozens)
- **No flavor options** — parve only
- **`isKit: true`** (sold per dozen unit)
- **Images:** same challah image set

### 4. Challah Bites with Filling
- **Price:** $18.00 per dozen
- **Min quantity:** 1 dozen
- **Quantity options:** 1–10 (dozens)
- **Filling options (flavor):** same 7 options as Filled Challah Buns (including Assorted)
- **All same price** — no `flavorPrices` needed
- **`isKit: true`**
- **Images:** same challah image set

### 5. Chocolate Babka
- **Base price:** $15.00 (full loaf)
- **Size options (flavor):**
  - Full Loaf — $15
  - Half Loaf — $8
- **`flavorPrices`:** `{ 'Full Loaf - $15': 15, 'Half Loaf - $8': 8 }`
- **Min quantity:** 1
- **Quantity options:** 1–10
- **`isKit: true`**
- **Images:** `images/challah pics/bobka.jpeg`

---

## Notice Box

Displayed at top of page (always active, no "orders closed" state):

> **Challah & Babka — Fresh Baked to Order**
> Orders must be placed **at least one day in advance**.
> For same-day availability, call **(281) 236-3047**.

---

## Allergen Display

Products with filling options show inline allergen notes next to each filling name in the dropdown. These are informational strings in the product description, not a separate UI component — keep it simple and consistent with existing pattern.

---

## Homepage Card (`index.html`)

Add an **active** card (no `holiday-unavailable` class, no `season-ended-badge`) in the holiday grid:

- Image: `images/challah pics/image0.jpeg`
- Title: Challah & Babka
- Description: Fresh-baked challah buns, filled buns, bites, and chocolate babka — available year-round, made to order.
- Button: "Order Now" → `challah.html`

---

## Navigation

Add "Challah & Babka" nav link to every page's `<nav>` block: `index.html`, `passover.html`, `valentines.html`, `purim.html`, `hanukkah.html`, and `challah.html` itself.

---

## Server Route

Add to `server/server.js`:
```js
app.get('/challah', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'challah.html'));
});
```

---

## Out of Scope

- No "orders closed" state — this is always open.
- No custom allergen UI component — inline text labels only.
- No new order submission logic — reuses existing `/api/submit-order` endpoint with `HOLIDAY = 'Challah & Babka'`.
