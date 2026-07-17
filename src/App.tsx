import ProductCard from "./components/ProductCard";
import { productsArray } from "./types/product";

export default function App() {
  return (
    <section className="bg-cream min-h-screen px-4 py-8">
      <h1 className="text-center text-5xl font-display text-gold">Anothe</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {productsArray.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
      </div>
    </section>
  )
}