import { useEffect, useState } from "react";
import { useCart } from "../context/useCart";
import type { Product } from "../types/product";
import { formatCurrency } from "../utils/formatCurrency";
import { defaultVariant, findVariant, isInStock } from "../utils/productHelpers";
import VariantPicker from "./VariantPicker";

interface ProductCardProps {
    product: Product
}

const ADDED_FEEDBACK_MS = 1500

export default function ProductCard({ product }: ProductCardProps) {
    const { dispatch } = useCart()
    const [justAdded, setJustAdded] = useState(false)
    const [variantId, setVariantId] = useState(() => defaultVariant(product).id)
    const variant = findVariant(product, variantId) ?? defaultVariant(product)
    const anyInStock = isInStock(product)

    useEffect(() => {
        if (!justAdded) {
            return
        }
        const timer = setTimeout(() => setJustAdded(false), ADDED_FEEDBACK_MS)
        return () => clearTimeout(timer)
    }, [justAdded])

    function handleAdd() {
        dispatch({ type: 'ADD', product, variant })
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
            <p className="text-lg font-semibold text-espresso">{formatCurrency(variant.price)}</p>
            {product.description && <p className="text-sm text-cocoa leading-relaxed">{product.description}</p>}
            <VariantPicker product={product} selectedId={variant.id} onChange={setVariantId} />
            {anyInStock
                ? <p className="text-sm text-green-700">In stock</p>
                : <p className="text-sm text-red-600">Out of stock</p>}
            <button
                className={`py-2 px-4 rounded-lg w-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${justAdded ? 'bg-gold text-white' : 'bg-espresso text-cream hover:bg-cocoa'}`}
                onClick={handleAdd}
                disabled={!variant.inStock}
            >
                {justAdded ? 'Added ✓' : 'Add to cart'}
            </button>
            <p className="sr-only" aria-live="polite">
                {justAdded ? `${product.name} (${variant.label}) added to cart` : ''}
            </p>
        </article>
    )
}
