import { useEffect, useState } from "react";
import { useCart } from "../context/useCart";
import type { Product } from "../types/product";
import { formatCurrency } from "../utils/formatCurrency";

interface ProductCardProps {
    product: Product
}

const ADDED_FEEDBACK_MS = 1500

export default function ProductCard({ product }: ProductCardProps) {
    const { dispatch } = useCart()
    const [justAdded, setJustAdded] = useState(false)
    const formatted = formatCurrency(product.price)

    useEffect(() => {
        if (!justAdded) {
            return
        }
        const timer = setTimeout(() => setJustAdded(false), ADDED_FEEDBACK_MS)
        return () => clearTimeout(timer)
    }, [justAdded])

    function handleAdd() {
        dispatch({ type: 'ADD', product })
        setJustAdded(true)
    }

    return (
        <article className="bg-white p-4 rounded-xl shadow-md flex flex-col space-y-2">
            <img
                src={product.image}
                alt={product.name}
                className="w-full aspect-4/3 object-cover rounded-lg bg-cream"
                loading="lazy"
            />
            <p className="text-sm text-gold uppercase">{product.category}</p>
            <h3 className="text-xl font-display text-cocoa">{product.name}</h3>
            <p className="text-lg font-semibold text-espresso">{formatted}</p>
            {product.description && <p className="text-sm text-cocoa leading-relaxed">{product.description}</p>}
            {product.variant && <p className="text-sm text-gold">{product.variant}</p>}
            {product.inStock
                ? <p className="text-sm text-green-700">In stock</p>
                : <p className="text-sm text-red-600">Out of stock</p>}
            <button
                className={`py-2 px-4 rounded-lg w-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${justAdded ? 'bg-gold text-white' : 'bg-espresso text-cream hover:bg-cocoa'}`}
                onClick={handleAdd}
                disabled={!product.inStock}
            >
                {justAdded ? 'Added ✓' : 'Add to cart'}
            </button>
            <p className="sr-only" aria-live="polite">
                {justAdded ? `${product.name} added to cart` : ''}
            </p>
        </article>
    )
}
