import { useCart } from "../context/CartContext";
import { buildOrderMessage } from "../utils/buildOrderMessage";
import { formatCurrency } from "../utils/formatCurrency";

const WHATSAPP_NUMBER = '27821234567'

export default function Cart() {
  const { items, dispatch } = useCart();

  if (items.length === 0) {
    return <p className="text-center text-cocoa">Your cart is empty</p>;
  }

  function whatsAppOrder() {
    const message = buildOrderMessage(items)
    const encoded = encodeURIComponent(message)
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`

    window.open(url, '_blank', 'noopener')
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const lineTotal = item.product.price * item.quantity
        const formatted = formatCurrency(lineTotal)

        return (
          <article
            key={item.product.id}
            className="bg-white py-4 px-8 rounded-lg"
          >
            <p className="text-cocoa">{item.product.name}</p>
            <p className="text-sm text-cocoa">Qty: {item.quantity}</p>
            <p className="font-semibold text-espresso">{formatted}</p>
            <div className="flex items-center gap-2">
                <button
                    className="bg-cream text-espresso px-3 py-1 rounded hover:bg-gold"
                    onClick={() => dispatch({ type: 'UPDATE_QUANTITY', productId: item.product.id, quantity: item.quantity - 1})}
                >
                    -
                </button>
                <button
                    className="bg-cream text-espresso px-3 py-1 rounded hover:bg-gold"
                    onClick={() => dispatch({ type: 'UPDATE_QUANTITY', productId: item.product.id, quantity: item.quantity + 1})}>
                    +
                </button>
                <button
                    className="text-sm text-red-600 hover:underline"
                    onClick={() => dispatch({ type: 'REMOVE', productId: item.product.id})}
                >
                    Remove
                </button>
            </div>
            
          </article>
        );
      })}
      <button
      className="bg-gold text-white w-full py-3 text-lg font-semibold rounded-lg hover:bg-espresso"
        onClick={whatsAppOrder}
      >
        Checkout on Whatsapp
      </button>
      <button
        className="border border-cocoa text-cocoa px-4 py-2 rounded-lg hover:bg-cream"
        onClick={() => dispatch({ type: 'CLEAR'})}
        >
        Clear Cart
      </button>
    </div>
  );
}