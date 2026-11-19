import { createRoot } from 'react-dom/client'
// Self-hosted fonts (latin subset, only the weights used). Bundled into /assets, so no
// request goes to Google: faster first paint, no visitor IPs shared, and a strict CSP works.
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/cormorant-garamond/latin-400.css'
import './index.css'
import App from './App.tsx'
import { CartProvider } from './context/CartProvider.tsx'
import { BrowserRouter } from 'react-router'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import ErrorBoundary from './components/ErrorBoundary.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    {/* Last resort if something outside the pages (header, cart) breaks. */}
    <ErrorBoundary fullPage>
      <CartProvider>
        <App />
      </CartProvider>
    </ErrorBoundary>
    <Analytics />
    <SpeedInsights />
  </BrowserRouter>
)
