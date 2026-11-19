import { useCart } from "../context/useCart";
import { formatCurrency } from "../utils/formatCurrency";
import { lineTotal } from "../utils/cartTotals";

export default function Cart() {
  const { items, dispatch } = useCart();

  if (items.length === 0) {
    return <p className="text-center text-cocoa">Your cart is empty</p>;
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
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
                    className="bg-cream text-espresso px-3 py-1 rounded hover:bg-gold"
                    aria-label={`Decrease quantity of ${name}`}
                    onClick={() => dispatch({ type: 'UPDATE_QUANTITY', productId, variantId, quantity: item.quantity - 1 })}
                >
                    -
                </button>
                <button
                    className="bg-cream text-espresso px-3 py-1 rounded hover:bg-gold"
                    aria-label={`Increase quantity of ${name}`}
                    onClick={() => dispatch({ type: 'UPDATE_QUANTITY', productId, variantId, quantity: item.quantity + 1 })}
                >
                    +
                </button>
                <button
                    className="text-sm text-red-600 hover:underline"
                    aria-label={`Remove ${name}`}
                    onClick={() => dispatch({ type: 'REMOVE', productId, variantId })}
                >
                    Remove
                </button>
            </div>
          </article>
        );
      })}
      <button
        className="border border-cocoa text-cocoa px-4 py-2 rounded-lg hover:bg-cream"
        onClick={() => dispatch({ type: 'CLEAR' })}
      >
        Clear Cart
      </button>
    </div>
  );
}
