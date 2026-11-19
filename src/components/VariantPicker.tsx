import { useId } from "react";
import type { Product } from "../types/product";
import { formatCurrency } from "../utils/formatCurrency";

interface VariantPickerProps {
    product: Product
    selectedId: string
    onChange: (variantId: string) => void
}

// Shows the single option as text, or a dropdown when a product has several
// sizes/shades. Sold-out options are listed but can't be chosen.
export default function VariantPicker({ product, selectedId, onChange }: VariantPickerProps) {
    const selectId = useId()

    if (product.variants.length === 1) {
        return <p className="text-sm text-gold">{product.variants[0].label}</p>
    }

    return (
        <div>
            <label htmlFor={selectId} className="sr-only">Choose an option for {product.name}</label>
            <select
                id={selectId}
                className="w-full border border-cocoa/40 rounded-lg px-3 py-2 bg-white text-cocoa"
                value={selectedId}
                onChange={e => onChange(e.target.value)}
            >
                {product.variants.map(v => (
                    <option key={v.id} value={v.id} disabled={!v.inStock}>
                        {v.label} — {formatCurrency(v.price)}{v.inStock ? '' : ' (sold out)'}
                    </option>
                ))}
            </select>
        </div>
    )
}
