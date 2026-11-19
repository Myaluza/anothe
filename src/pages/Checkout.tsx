import { Link } from "react-router";
import Cart from "../components/Cart";
import CheckoutForm from "../components/CheckoutForm";
import { useCart } from "../context/useCart";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function Checkout() {
    const { items } = useCart()
    useDocumentTitle('Checkout')

    return (
        <section className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-display text-gold text-center">Your Cart</h2>
            <Cart />
            {items.length > 0 && <CheckoutForm />}
            <Link className="block text-center text-cocoa hover:underline" to='/'>Continue shopping</Link>
        </section>
    )
}
