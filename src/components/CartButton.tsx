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
    const buttonStyles = "bg-gold text-cream rounded py-4 px-8 fixed top-4 right-4 z-40 hover:bg-espresso"

    if (totalItems === 0 || pathname === '/checkout') {
        return null
    }

    return (
        <>
            <Link to='/checkout' className={`${buttonStyles} lg:hidden`}>
                Cart ({totalItems})
            </Link>
            <button onClick={onOpenCart} className={`${buttonStyles} hidden lg:block`}>
                Cart ({totalItems})
            </button>
        </>
    )
}
