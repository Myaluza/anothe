import { useEffect, useRef } from "react";
import { Link } from "react-router";
import Cart from "./Cart";
import { useCart } from "../context/useCart";
import { formatCurrency } from "../utils/formatCurrency";
import { cartTotal } from "../utils/cartTotals";

interface CartDrawerProps {
    isOpen: boolean
    onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { items } = useCart()
    const closeButtonRef = useRef<HTMLButtonElement>(null)
    const totalCents = cartTotal(items)

    useEffect(() => {
        if (!isOpen) {
            return
        }

        // Remember what opened the drawer so focus can go back there when it closes.
        const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
        closeButtonRef.current?.focus()

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            // Skipped when the opener is gone, e.g. the Cart button after going to checkout.
            if (opener?.isConnected) {
                opener.focus({ preventScroll: true })
            }
        }
    }, [isOpen, onClose])

    return (
        <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`} inert={!isOpen}>
            <div
                className={`absolute inset-0 bg-cocoa/40 transition-opacity motion-reduce:transition-none ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
                aria-hidden="true"
            />
            <aside
                role="dialog"
                aria-modal="true"
                aria-labelledby="cart-drawer-title"
                className={`absolute right-0 top-0 h-full w-full max-w-md bg-cream shadow-xl flex flex-col transition-transform motion-reduce:transition-none ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <header className="flex items-center justify-between px-6 py-4 border-b border-gold-light/40">
                    <h2 id="cart-drawer-title" className="text-2xl font-display text-gold">Your Cart</h2>
                    <button
                        ref={closeButtonRef}
                        onClick={onClose}
                        className="text-cocoa text-2xl leading-none w-10 h-10 flex items-center justify-center hover:text-gold"
                        aria-label="Close cart"
                    >
                        ×
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <Cart />
                </div>

                {items.length > 0 && (
                    <footer className="border-t border-gold-light/40 px-6 py-4 space-y-3">
                        <p className="flex justify-between text-lg text-espresso font-semibold">
                            <span>Subtotal</span>
                            <span>{formatCurrency(totalCents)}</span>
                        </p>
                        <p className="text-sm text-cocoa/80">Delivery or collection is chosen at checkout.</p>
                        <Link
                            to="/checkout"
                            onClick={onClose}
                            className="block w-full text-center bg-gold text-white py-3 rounded-lg text-lg font-semibold hover:bg-espresso"
                        >
                            Checkout
                        </Link>
                    </footer>
                )}
            </aside>
        </div>
    )
}
