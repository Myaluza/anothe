import { useState } from "react";
import { Link } from "react-router";
import { useCart } from "../context/useCart";
import type { Product } from "../types/product";
import { formatCurrency } from "../utils/formatCurrency";
import { defaultVariant, findVariant, isInStock } from "../utils/productHelpers";
import { useAddedFeedback } from "../hooks/useAddedFeedback";
import VariantPicker from "./VariantPicker";
import QuantityStepper from "./QuantityStepper";

interface ProductCardProps {
    product: Product
    // True for cards in the first row: their image loads straight away (it's likely the LCP element).
    priority?: boolean
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
    const { dispatch } = useCart()
    const [justAdded, showAdded] = useAddedFeedback()
    const [variantId, setVariantId] = useState(() => defaultVariant(product).id)
    const [quantity, setQuantity] = useState(1)
    const variant = findVariant(product, variantId) ?? defaultVariant(product)
    const productUrl = `/product/${product.slug}`

    function handleAdd() {
        dispatch({ type: 'ADD', product, variant, quantity })
        showAdded()
    }

    return (
        <article className="bg-white p-4 rounded-xl shadow-md flex flex-col space-y-2">
            <Link to={productUrl} tabIndex={-1} aria-hidden="true">
                <img
                    src={product.image}
                    alt=""
                    width={800}
                    height={600}
                    className="w-full h-auto aspect-4/3 object-cover rounded-lg bg-cream hover:opacity-90"
                    loading={priority ? "eager" : "lazy"}
                    fetchPriority={priority ? "high" : "auto"}
                />
            </Link>
            <p className="text-sm text-gold uppercase">{product.category}</p>
            <h2 className="text-xl font-display text-cocoa">
                <Link to={productUrl} className="hover:text-gold">{product.name}</Link>
            </h2>
            <p className="text-lg font-semibold text-espresso">{formatCurrency(variant.price)}</p>
            {product.description && <p className="text-sm text-cocoa leading-relaxed">{product.description}</p>}
            <VariantPicker product={product} selectedId={variant.id} onChange={setVariantId} />
            {isInStock(product)
                ? <p className="text-sm text-green-700">In stock</p>
                : <p className="text-sm text-red-700">Out of stock</p>}
            <QuantityStepper value={quantity} onChange={setQuantity} productName={product.name} disabled={!variant.inStock} />
            <button
                className={`py-2 px-4 rounded-lg w-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${justAdded ? 'bg-gold text-white' : 'bg-espresso text-cream hover:bg-cocoa'}`}
                onClick={handleAdd}
                disabled={!variant.inStock}
            >
                {justAdded ? 'Added ✓' : 'Add to cart'}
            </button>
            <p className="sr-only" aria-live="polite">
                {justAdded ? `${quantity} × ${product.name} (${variant.label}) added to cart` : ''}
            </p>
        </article>
    )
}
