import { Link, useLocation } from "react-router";
import { useCart } from "../context/useCart";
import { cartCount } from "../utils/cartTotals";

interface CartButtonProps {
    onOpenCart: () => void
}

export default function CartButton({ onOpenCart }: CartButtonProps) {
    const { items } = useCart()
    const { pathname } = useLocation()
    const totalItems = cartCount(items)
    // Lives in the sticky header. Phones go to the checkout page; desktop opens the drawer.
    const buttonStyles = "bg-gold text-cream rounded py-2 px-3 sm:py-3 sm:px-6 hover:bg-espresso"

    if (totalItems === 0 || pathname === '/checkout') {
        return null
    }

    return (
        <>
            <Link to='/checkout' className={`${buttonStyles} inline-block lg:hidden`}>
                Cart ({totalItems})
            </Link>
            <button onClick={onOpenCart} className={`${buttonStyles} hidden lg:block`}>
                Cart ({totalItems})
            </button>
        </>
    )
}
