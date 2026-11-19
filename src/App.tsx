import { Routes, Route, useLocation } from 'react-router'
import { useCallback, useState } from 'react'
import Home from './pages/Home'
import Checkout from './pages/Checkout'
import ProductDetail from './pages/ProductDetail'
import OrderConfirmed from './pages/OrderConfirmed'
import About from './pages/About'
import Header from './components/Header'
import NotFound from './pages/NotFound'
import CartButton from './components/CartButton'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import { useScrollToTop } from './hooks/useScrollToTop'

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
      <Header />
      <CartButton onOpenCart={openCart} />
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/product/:slug' element={<ProductDetail />} />
        <Route path='/about' element={<About />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/order/confirmed' element={<OrderConfirmed />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  )
}
