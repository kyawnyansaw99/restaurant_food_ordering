# Saffron & Spoon — Restaurant Online Ordering

A React + Vite + Tailwind food ordering app with a customer side and a kitchen/staff side.

**Live demo:** https://kyawnyansaw99.github.io/restaurant_food_ordering/ · Kitchen board: https://kyawnyansaw99.github.io/restaurant_food_ordering/#/kitchen

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Features

**Customers**
- Menu by category with sticky category tabs, search, and filters (Popular / Vegetarian / Spicy)
- Item customization: protein, spice level, add-ons, special instructions, quantity
- Cart drawer with free-delivery progress bar
- Prices in Thai Baht (฿), VAT 7% included; delivery ฿39, free over ฿500 (see `RESTAURANT` in `src/data/menu.js`)
- Checkout: delivery or pickup, contact details with validation, cash/card payment, promo codes (`WELCOME10`, `SPOON20`)
- Live order tracking page with status timeline and ETA; cancel while the order is still "placed"
- Order history with one-click reorder

**Kitchen (`#/kitchen`)**
- Order board: New → Preparing → Ready → Out for delivery → Delivered
- Today's order count, revenue and average order value
- Menu management: add / edit / delete dishes, mark items sold out
- Reset demo data

## Deployment

Every push to `main` builds the site and deploys it to GitHub Pages with GitHub Actions
(`.github/workflows/deploy.yml`). The app uses a hash router and a relative Vite `base`, so it
works under the `/restaurant_food_ordering/` path without extra server setup.

## Photos

Dish photos live in `public/images/<menu-id>.jpg` (e.g. `n1.jpg` = Pad Thai). They are sample
photos from TheMealDB and TheCocktailDB, for demo use. For a real restaurant, replace them
with photos of your own dishes (keep the same file names), or set a Photo URL per dish in `/kitchen`.

## How data is stored

Everything is saved in the browser's `localStorage` — there is no backend yet.
Open the customer view and `#/kitchen` in two tabs of the same browser: status changes
sync between tabs automatically.

To go to production you'd add a backend (e.g. Node/Express or Supabase) for orders and
menu, real payments (e.g. Stripe), and staff login for `/kitchen`.

## Project layout

```
src/
  data/menu.js            restaurant settings, categories, seed menu, order statuses
  lib/pricing.js          price, totals, tax, delivery fee, promo codes
  context/StoreContext.jsx  cart / orders / menu state + localStorage
  components/             Navbar, MenuItemCard, ItemModal, CartDrawer, StatusBadge, FoodTile
  pages/                  MenuPage, CheckoutPage, OrderPage, OrdersPage, KitchenPage
```
