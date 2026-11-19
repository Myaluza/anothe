import { useState } from "react";
import { Link, useParams } from "react-router";
import { useCart } from "../context/useCart";
import { products } from "../data/products";
import type { Product } from "../types/product";
import { formatCurrency } from "../utils/formatCurrency";
import { defaultVariant, findVariant } from "../utils/productHelpers";
import { useAddedFeedback } from "../hooks/useAddedFeedback";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import VariantPicker from "../components/VariantPicker";
import QuantityStepper from "../components/QuantityStepper";
import NotFound from "./NotFound";

export default function ProductDetail() {
    const { slug } = useParams()
    const product = products.find(p => p.slug === slug)

    if (!product) {
        return <NotFound />
    }

    // Keyed so the chosen option and quantity reset when moving between products.
    return <ProductDetailContent key={product.id} product={product} />
}

function ProductDetailContent({ product }: { product: Product }) {
    const { dispatch } = useCart()
    const [justAdded, showAdded] = useAddedFeedback()
    const [variantId, setVariantId] = useState(() => defaultVariant(product).id)
    const [quantity, setQuantity] = useState(1)
    const variant = findVariant(product, variantId) ?? defaultVariant(product)

    useDocumentTitle(product.name)

    function handleAdd() {
        dispatch({ type: 'ADD', product, variant, quantity })
        showAdded()
    }

    return (
        <section className="max-w-5xl mx-auto">
            <Link to="/" className="inline-block py-2 mb-4 text-cocoa hover:underline">← Back to shop</Link>

            <div className="grid gap-8 md:grid-cols-2 bg-white rounded-xl shadow-md p-6">
                <img
                    src={product.image}
                    alt={product.name}
                    width={800}
                    height={600}
                    fetchPriority="high"
                    className="w-full h-auto aspect-4/3 object-cover rounded-lg bg-cream"
                />

                <div className="flex flex-col space-y-4">
                    <p className="text-sm text-gold uppercase">{product.category}</p>
                    <h1 className="text-4xl font-display text-cocoa">{product.name}</h1>
                    <p className="text-2xl font-semibold text-espresso">{formatCurrency(variant.price)}</p>
                    {product.description && <p className="text-cocoa leading-relaxed">{product.description}</p>}

                    <VariantPicker product={product} selectedId={variant.id} onChange={setVariantId} />

                    {variant.inStock
                        ? <p className="text-sm text-green-700">In stock</p>
                        : <p className="text-sm text-red-700">Out of stock</p>}

                    <QuantityStepper value={quantity} onChange={setQuantity} productName={product.name} disabled={!variant.inStock} />

                    <button
                        className={`py-3 px-4 rounded-lg w-full text-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${justAdded ? 'bg-gold text-white' : 'bg-espresso text-cream hover:bg-cocoa'}`}
                        onClick={handleAdd}
                        disabled={!variant.inStock}
                    >
                        {justAdded ? 'Added ✓' : 'Add to cart'}
                    </button>
                    <p className="sr-only" aria-live="polite">
                        {justAdded ? `${quantity} × ${product.name} (${variant.label}) added to cart` : ''}
                    </p>
                </div>
            </div>
        </section>
    )
}
