import { Routes, Route, useLocation } from 'react-router'
import { lazy, Suspense, useCallback, useState } from 'react'
import Home from './pages/Home'
import Header from './components/Header'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import { useScrollToTop } from './hooks/useScrollToTop'
import { importWithReload } from './utils/importWithReload'

// The shop page loads with the app; other pages download only when first visited.
// If that download fails because a newer version was deployed meanwhile, the page reloads once.
const ProductDetail = lazy(() => importWithReload(() => import('./pages/ProductDetail')))
const Checkout = lazy(() => importWithReload(() => import('./pages/Checkout')))
const OrderConfirmed = lazy(() => importWithReload(() => import('./pages/OrderConfirmed')))
const About = lazy(() => importWithReload(() => import('./pages/About')))
const NotFound = lazy(() => importWithReload(() => import('./pages/NotFound')))

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { pathname } = useLocation()
  const [lastPathname, setLastPathname] = useState(pathname)
  useScrollToTop()

  // Close the drawer whenever the route changes (e.g. browser back/forward).
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setIsCartOpen(false)
  }

  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])

  return (
    <div className='bg-cream min-h-screen px-4 py-8'>
      {/* While the drawer is open, the page behind it can't be reached by keyboard or screen reader. */}
      <div inert={isCartOpen}>
        <a
          href='#main'
          className='sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 bg-espresso text-cream px-4 py-2 rounded'
        >
          Skip to content
        </a>
        <Header onOpenCart={openCart} />
        <main id='main' tabIndex={-1} className='focus:outline-none'>
          {/* If a page breaks, the header, footer and cart keep working; going to another page clears it. */}
          <ErrorBoundary resetKey={pathname}>
            {/* Fixed-height placeholder while a page downloads, so the footer doesn't jump. */}
            <Suspense fallback={<div className='min-h-[60vh]' aria-busy='true' />}>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/product/:slug' element={<ProductDetail />} />
                <Route path='/about' element={<About />} />
                <Route path='/checkout' element={<Checkout />} />
                <Route path='/order/confirmed' element={<OrderConfirmed />} />
                <Route path='*' element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </div>
  )
}
