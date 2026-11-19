import { MAX_QUANTITY_PER_ADD } from "../config";

interface QuantityStepperProps {
    value: number
    onChange: (value: number) => void
    // Used in the button labels, e.g. "Increase quantity of cream", so screen readers know which product.
    productName: string
    disabled?: boolean
}

// − / number / + control used on product cards and the product page.
export default function QuantityStepper({ value, onChange, productName, disabled = false }: QuantityStepperProps) {
    const stepButton = "bg-cream text-espresso w-10 h-10 rounded hover:bg-gold-light disabled:opacity-40 disabled:hover:bg-cream"

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm text-cocoa">Quantity</span>
            <button
                type="button"
                className={stepButton}
                aria-label={`Decrease quantity of ${productName}`}
                disabled={disabled || value <= 1}
                onClick={() => onChange(value - 1)}
            >
                −
            </button>
            <span className="w-8 text-center text-espresso font-semibold" aria-live="polite">{value}</span>
            <button
                type="button"
                className={stepButton}
                aria-label={`Increase quantity of ${productName}`}
                disabled={disabled || value >= MAX_QUANTITY_PER_ADD}
                onClick={() => onChange(value + 1)}
            >
                +
            </button>
        </div>
    )
}
