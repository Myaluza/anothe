import Cart from "./components/Cart";
import ProductCard from "./components/ProductCard";
import { useCart } from "./context/CartContext";
import { productsArray } from "./types/product";
import { formatCurrency } from "./utils/formatCurrency";

export default function App() {
  const { items } = useCart()
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalCents = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const totalFormatted = formatCurrency(totalCents)
  return (
    <section className="bg-cream min-h-screen px-4 py-8">
      <h1 className="text-center text-5xl font-display text-gold">Anothe</h1>
      <p className="text-center text-cocoa">{totalItems} items · {totalFormatted}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {productsArray.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
      </div>
      <Cart />
    </section>
  )
}