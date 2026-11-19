# Anothe

A small online shop for skincare, makeup and fragrance. Customers browse products, add them to a cart, and send their order to the shop on WhatsApp, with no payments or accounts.

Live site: https://anothe-rouge.vercel.app

Built with React 19, TypeScript, Vite, Tailwind CSS 4 and React Router.

## Running it locally

Needs Node 24.

```sh
npm install
npm run dev        # start the dev server at http://localhost:5173
npx vitest run     # run the tests once (npm test runs them in watch mode)
npm run lint       # check the code with ESLint
npm run build      # type-check and build to dist/
```

## Editing the shop

- **Products:** `src/data/products.ts`. Each product has a `slug` (its page address, e.g. `/product/eye-liner`) and one or more `variants`, which are sizes or shades. Each variant has its own `label`, `price` and `inStock`. Prices are in **cents**, so `15000` is R150,00. Set a variant's `inStock: false` to show it as sold out.
- **Product photos:** put them in `public/images/` and set each product's `image` to `/images/<file>`. Aim for about 800px wide and under 200 KB.
- **WhatsApp number and shop name:** `src/config.ts`. Use the number in international format with no `+` or spaces (e.g. `27821234567`).
- **Delivery fee, areas and collection point:** `DELIVERY_FEE_CENTS` (one standard fee, in cents), `DELIVERY_AREAS` (the places listed on the About page) and `COLLECTION` in `src/config.ts`. The checkout and the About page both read from here.
- **About, returns and FAQ text:** `src/data/about.ts`.
- **Colours and fonts:** the `@theme` block in `src/index.css`.

Carts are saved in the customer's browser. When they come back, the cart is checked against the current product list, so prices are updated and removed or sold-out options are dropped.

Each order gets a reference such as `ANO-K3F9Q7X`, which appears in the WhatsApp message and on the confirmation page. An order is only placed once the customer presses Send in WhatsApp.

Visitor numbers are in the Vercel dashboard under **Analytics**. They're cookieless page views only.

## How deploys work

The site is hosted on Vercel, linked to this GitHub repo:

- Every push to `main` deploys to production.
- Every pull request gets its own preview deployment, and GitHub Actions runs lint, tests and the build.

`vercel.json` sends every path to `index.html`, so page links like `/checkout` work when opened directly or reloaded.
