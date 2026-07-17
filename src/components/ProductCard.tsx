import type { Product } from "../types/product";

interface ProductCardProps {
    product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
    const rands = product.price / 100
    const formatted = rands.toLocaleString('en-ZA', {
        style: 'currency',
        currency: 'ZAR'
    })

    return (
        <article className="bg-white p-4 rounded-xl shadow-md flex flex-col space-y-2">
            <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg"
            />
            <p className="text-sm text-gold uppercase">{product.category}</p>
            <h3 className="text-xl font-display text-cocoa">{product.name}</h3>
            <p className="text-lg font-semibold text-espresso">{formatted}</p>
            {product.description && <p className="text-sm text-cocoa leading-relaxed">{product.description}</p>}
            {product.variant && <p className="text-sm text-gold">{product.variant}</p>}
            {product.inStock 
                ? <p className="text-sm text-green-700">In stock</p>
                : <p className="text-sm text-red-600">Out of stock</p>}
        </article>
    )
}