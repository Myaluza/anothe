import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CartProvider } from './context/CartProvider.tsx'
import { BrowserRouter } from 'react-router'
import { Analytics } from '@vercel/analytics/react'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <CartProvider>
      <App />
    </CartProvider>
    <Analytics />
  </BrowserRouter>
)
