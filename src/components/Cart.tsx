import { useEffect, useRef } from "react";
import { useCart } from "../context/useCart";
import { formatCurrency } from "../utils/formatCurrency";
import { lineTotal } from "../utils/cartTotals";

export default function Cart() {
  const { items, dispatch } = useCart();
  const listRef = useRef<HTMLDivElement>(null)
  const emptyRef = useRef<HTMLParagraphElement>(null)
  // When a line disappears, the button that was clicked goes with it and keyboard focus
  // would fall back to the page. Remember where it was so focus can stay in the cart.
  const focusAfterRemoval = useRef<number | null>(null)

  useEffect(() => {
    const index = focusAfterRemoval.current
    if (index === null) return
    focusAfterRemoval.current = null
    const removeButtons = listRef.current?.querySelectorAll<HTMLButtonElement>('[data-remove]') ?? []
    if (removeButtons.length > 0) {
      // The line that moved into the removed one's place, or the new last line.
      removeButtons[Math.min(index, removeButtons.length - 1)].focus()
    } else {
      emptyRef.current?.focus()
    }
  }, [items])

  if (items.length === 0) {
    return <p ref={emptyRef} tabIndex={-1} className="text-center text-cocoa">Your cart is empty</p>;
  }

  return (
    <div ref={listRef} className="space-y-4">
      {items.map((item, index) => {
        const productId = item.product.id
        const variantId = item.variant.id
        const name = `${item.product.name} (${item.variant.label})`

        return (
          <article
            key={`${productId}:${variantId}`}
            className="bg-white py-4 px-8 rounded-lg"
          >
            <p className="text-cocoa">{item.product.name}</p>
            <p className="text-sm text-gold">{item.variant.label}</p>
            <p className="text-sm text-cocoa">Qty: {item.quantity}</p>
            <p className="font-semibold text-espresso">{formatCurrency(lineTotal(item))}</p>
            <div className="flex items-center gap-2">
                <button
                    className="bg-cream text-espresso w-10 h-10 rounded hover:bg-gold-light"
                    aria-label={`Decrease quantity of ${name}`}
                    onClick={() => {
                        if (item.quantity === 1) focusAfterRemoval.current = index
                        dispatch({ type: 'UPDATE_QUANTITY', productId, variantId, quantity: item.quantity - 1 })
                    }}
                >
                    -
                </button>
                <button
                    className="bg-cream text-espresso w-10 h-10 rounded hover:bg-gold-light"
                    aria-label={`Increase quantity of ${name}`}
                    onClick={() => dispatch({ type: 'UPDATE_QUANTITY', productId, variantId, quantity: item.quantity + 1 })}
                >
                    +
                </button>
                <button
                    className="text-sm text-red-700 hover:underline min-h-10 px-2"
                    aria-label={`Remove ${name}`}
                    data-remove
                    onClick={() => {
                        focusAfterRemoval.current = index
                        dispatch({ type: 'REMOVE', productId, variantId })
                    }}
                >
                    Remove
                </button>
            </div>
          </article>
        );
      })}
      <button
        className="border border-cocoa text-cocoa px-4 py-2 rounded-lg hover:bg-cream"
        onClick={() => {
          focusAfterRemoval.current = 0
          dispatch({ type: 'CLEAR' })
        }}
      >
        Clear Cart
      </button>
    </div>
  );
}
