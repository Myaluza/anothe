import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// The security headers (CSP etc.) live in vercel.json. `npm run preview` serves the same ones,
// so a CSP violation shows up locally and in the E2E tests, not only after deploying.
interface VercelHeaderRule {
  source: string
  headers: { key: string; value: string }[]
}
const vercelConfig = JSON.parse(readFileSync(new URL('./vercel.json', import.meta.url), 'utf8')) as { headers: VercelHeaderRule[] }
const siteWideHeaders = Object.fromEntries(
  vercelConfig.headers.find(rule => rule.source === '/(.*)')!.headers.map(h => [h.key, h.value]),
)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: {
    headers: siteWideHeaders,
  },
  build: {
    rolldownOptions: {
      output: {
        // Third-party code (React, router, analytics) goes in its own file. It only changes
        // when packages are updated, so returning visitors keep it cached across deploys.
        codeSplitting: {
          groups: [{ name: 'vendor', test: /[\\/]node_modules[\\/]/ }],
        },
      },
    },
  },
})
