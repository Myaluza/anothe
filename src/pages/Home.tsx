import { useSearchParams } from "react-router";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/useCart";
import { products } from "../data/products";
import { CATEGORIES, type Category } from "../types/product";
import { filterProducts } from "../utils/filterProducts";
import { formatCurrency } from "../utils/formatCurrency";
import { cartCount, cartTotal } from "../utils/cartTotals";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

function parseCategory(value: string | null): Category | null {
    return CATEGORIES.find(c => c === value) ?? null
}

export default function Home() {
    const { items } = useCart()
    useDocumentTitle(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const category = parseCategory(searchParams.get('category'))
    const query = searchParams.get('q') ?? ''

    const totalItems = cartCount(items)
    const totalCents = cartTotal(items)
    const visibleProducts = filterProducts(products, { category, query })

    function updateParams(next: { category?: Category | null; q?: string }) {
        const params = new URLSearchParams(searchParams)
        if ('category' in next) {
            if (next.category) params.set('category', next.category)
            else params.delete('category')
        }
        if ('q' in next) {
            if (next.q) params.set('q', next.q)
            else params.delete('q')
        }
        setSearchParams(params, { replace: true })
    }

    const pillBase = "px-4 py-2 min-h-10 rounded-full border text-sm capitalize transition-colors"
    const pillClass = (active: boolean) =>
        `${pillBase} ${active ? 'bg-espresso border-espresso text-cream' : 'border-cocoa/70 text-cocoa hover:border-gold-light'}`

    return(
        <section>
            <h1 className="text-center text-5xl font-display text-gold">Anothe</h1>
            <p className="text-center text-cocoa">{totalItems} {totalItems === 1 ? 'item' : 'items'} · {formatCurrency(totalCents)}</p>

            <div className="max-w-3xl mx-auto my-6 space-y-4">
                <label htmlFor="product-search" className="sr-only">Search products</label>
                <input
                    id="product-search"
                    type="search"
                    placeholder="Search products"
                    className="w-full border border-cocoa/70 rounded-lg px-4 py-2 bg-white"
                    value={query}
                    onChange={e => updateParams({ q: e.target.value })}
                />
                <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter by category">
                    <button className={pillClass(category === null)} aria-pressed={category === null} onClick={() => updateParams({ category: null })}>
                        All
                    </button>
                    {CATEGORIES.map(c => (
                        <button key={c} className={pillClass(category === c)} aria-pressed={category === c} onClick={() => updateParams({ category: c })}>
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {visibleProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {visibleProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center text-cocoa space-y-3 py-12">
                    <p>No products match your search.</p>
                    <button className="underline hover:text-gold" onClick={() => setSearchParams({}, { replace: true })}>
                        Clear filters
                    </button>
                </div>
            )}
        </section>
    )
}
