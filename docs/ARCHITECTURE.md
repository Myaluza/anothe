# Anothe: how the site is built

This explains how the shop works, why it's built this way, and what to change if it grows. For day-to-day editing (products, prices, text), see the [README](../README.md).

## In one paragraph

Anothe is a **static website**: a set of files built once and served from Vercel's global CDN. There is no server code, database, login or payment system. Customers browse, build a cart in their own browser, and the checkout writes a WhatsApp message that **the customer sends themselves**. The shop confirms availability and payment with them on WhatsApp. This keeps running costs at zero, leaves nothing to hack on a server, and means the site can't lose orders, because it never holds them.

## Folder layout

| Folder | What's in it |
|---|---|
| `src/pages/` | One file per page: shop (`Home`), product, About & FAQ, checkout, order confirmation, 404 |
| `src/components/` | Pieces used on several pages: header, footer, cart, cart panel, product card, checkout form, quantity picker, error page |
| `src/data/` | Shop content: products, About/returns/FAQ/privacy text |
| `src/config.ts` | Shop settings: name, WhatsApp number, delivery fee and areas, collection point |
| `src/context/`, `src/reducers/` | The cart: what's in it, and the add/change/remove rules |
| `src/utils/` | Small pure functions with unit tests next to them: prices, totals, delivery fee, order message, validation, order reference |
| `src/hooks/` | Page title, scroll position, "Added ✓" feedback |
| `public/` | Files served as they are: product images, favicon |
| `e2e/` | Browser tests (Playwright + axe) |
| `.github/workflows/` | CI on every pull request, and a production smoke check every 6 hours |

## How an order flows

```
products.ts ──► shop / product page ──► cart (reducer) ──► saved in the browser (localStorage)
                                              │
                                              ▼
                                checkout form ──► validation ──► WhatsApp message (wa.me link)
                                              │                         │
                                              ▼                         ▼
                           confirmation page (sessionStorage)   customer presses Send
```

1. **Products** are defined in `src/data/products.ts`. Each has one or more variants (sizes or shades) with their own price and stock flag.
2. **The cart** lives in a React reducer (`src/reducers/cartReducer.ts`) and is saved to the visitor's `localStorage`. On the next visit it's checked against the current products (`rehydrateCart`): prices update, and removed or sold-out options are dropped.
3. **Checkout** validates the name, phone, and address (for delivery) in the browser. It then builds a plain-text order with a reference such as `ANO-K3F9Q7X` and opens `wa.me/<number>?text=…`.
4. **The confirmation page** shows the reference and total from `sessionStorage`, which clears when the tab closes. It can reopen or copy the message.

## Key decisions

- **Prices are whole cents** (`15000` = R150,00), so totals never have rounding errors.
- **Filters and search live in the URL** (`/?category=makeup&q=liner`), so a filtered view can be shared or bookmarked.
- **One delivery fee** (`DELIVERY_FEE_CENTS`). Collection is free.
- **Pages load on demand.** The shop page comes with the first download, and other pages download when first opened. Third-party code sits in a separate `vendor` file that rarely changes, so returning visitors keep it cached across deploys.
- **Built files are cached for a year** (`/assets/*`, with content-hashed names). `index.html` is always re-checked, so a deploy reaches everyone straight away. Every other address is sent to the app, except `/assets/` and `/images/`: a file missing from those gives a real 404 instead of the shop page, so the smoke check notices.
- **Fonts are self-hosted.** No requests go to Google: faster first paint, visitors' IP addresses aren't shared, and a strict security policy is possible.

## Security

- **No secrets exist.** The site has no API keys, passwords or tokens. The WhatsApp number is public by design.
- **Security headers** (`vercel.json`), on every page:
  - A strict Content-Security-Policy that only allows the site's own files.
  - HSTS, `nosniff`, `X-Frame-Options: DENY` and a strict `Referrer-Policy`.
  - A `Permissions-Policy` that turns off camera, microphone and location.
  - `npm run preview` serves the same headers, and every browser test fails on a policy violation.
- **Dependencies:** Dependabot opens weekly update PRs, and CI fails on high or critical advisories in code that ships to the browser.
- **Input:** fields have length limits, and validation runs before the message is built. The message only goes to the customer's own WhatsApp, so there's no server to inject into.
- **Trade-off:** the Vercel preview toolbar (comments on preview deployments) is blocked by the policy. The site itself is unaffected.

## Privacy (POPIA / GDPR)

The privacy notice is at `/about#privacy`, and its text is in `src/data/about.ts`.
- **Personal details** (name, phone, address) are typed by the customer and go only into the WhatsApp message they choose to send. The site never stores or transmits them anywhere else.
- **In the browser:** the cart is kept in `localStorage`, and the last order in `sessionStorage` (cleared when the tab closes).
- **Analytics** (Vercel Web Analytics and Speed Insights) are cookieless and anonymous, so no consent banner is needed.
- **Still to fill in:** the Information Officer's details in `src/data/about.ts` are placeholders.

## Reliability and monitoring

- **Error page:** if a page breaks, visitors see "Something went wrong" with Reload, WhatsApp and back-to-shop options. The header, footer and cart keep working.
- **Deploys mid-visit:** if a page's file is gone after a new deploy, the site reloads once to pick up the new version. A flag prevents loops, and there's no reload while offline.
- **Speed Insights** reports real visitors' loading speed (Core Web Vitals) in the Vercel dashboard. **Web Analytics** reports visits.
- **Smoke check** (`.github/workflows/smoke.yml`) loads the live site every 6 hours. It checks pages, security headers and that every script downloads. GitHub emails the owner if it fails, and it can also be run by hand from the Actions tab.

## Testing

| Command | What it covers |
|---|---|
| `npx vitest run` | Unit tests for the cart rules, prices, delivery fee, validation, order message, reload-once |
| `npm run test:e2e` | Browser tests at desktop and phone size against the production build. They cover shopping, cart, both checkout types with the WhatsApp message checked, errors, 404, offline, and an **axe WCAG 2.2 AA scan of every page** |
| `npm run lint` | ESLint |
| `npm run build` | Type check and production build |

CI runs all of them on every pull request. `main` is protected, so a PR can't merge until the `check` and `e2e` jobs pass.

## Releasing and rolling back

1. Open a pull request. Vercel builds a **preview deployment**, which is the staging site: a private URL with the exact build that will go live. CI runs the checks.
2. Check the preview, then merge. Vercel deploys `main` to production. Deploys are atomic: visitors get either the old site or the new one, never a mix.
3. **To undo a bad release:** in the Vercel dashboard, go to **Deployments**, open the previous good one, and choose **Instant Rollback**. It takes seconds and needs no rebuild. Then fix forward with a new PR.

### Settings per environment

`VITE_WHATSAPP_NUMBER` can be set in **Vercel, under Project settings → Environment Variables**, with a different value for **Production** and **Preview**. For example, preview deployments can send test orders to a staff number. If it isn't set, or isn't a valid number, the default in `src/config.ts` is used. It's read at build time, so redeploy after changing it.

## Not needed today, and what to add if that changes

These are deliberately absent because the site has no server, accounts or payments:

| Item | Why not now | Add it when… |
|---|---|---|
| Server-side validation, rate limiting, bot protection | No server receives anything; the customer sends the order | …orders are submitted to a server or database |
| Secrets management | There are no secrets | …any API key is used: keep it in Vercel environment variables, used only from server functions and never in `src/` |
| Database, scaling, sessions | Static files on a CDN already scale to any traffic, with no state to share | …accounts or stock levels are stored centrally |
| Payment security (PCI DSS) | No payments on the site | …online payments are added: use a hosted checkout (e.g. PayFast, Yoco or Stripe) so card details never touch this site, and add the provider to the CSP |
| Cookie consent banner | No cookies or tracking | …a tool that sets non-essential cookies is added |
| Error tracking service (e.g. Sentry) | Few moving parts; the error page, smoke check and Speed Insights cover it | …custom code paths grow, or errors need alerting |
