import { Link, NavLink } from "react-router";
import { SHOP_NAME } from "../config";
import CartButton from "./CartButton";

interface HeaderProps {
    onOpenCart: () => void
}

// Sticks to the top so the Cart button is always reachable. Because the button sits in
// the header's flow (not fixed over it), it can never cover the links, and with large
// text the header wraps onto a second line instead of overflowing.
export default function Header({ onOpenCart }: HeaderProps) {
    const navClass = ({ isActive }: { isActive: boolean }) =>
        `inline-flex items-center min-h-10 hover:text-gold ${isActive ? 'text-espresso font-semibold underline underline-offset-4 decoration-gold' : 'text-cocoa'}`

    return (
        <header className="sticky top-0 z-30 -mx-4 -mt-8 mb-6 px-4 py-3 bg-cream/95 backdrop-blur border-b border-gold-light/30 flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 min-h-16">
            <Link to="/" className="text-2xl font-display text-gold">{SHOP_NAME}</Link>
            <nav aria-label="Main" className="flex gap-4 text-sm">
                <NavLink to="/" end className={navClass}>Shop</NavLink>
                <NavLink to="/about" className={navClass}>About</NavLink>
            </nav>
            <div className="ml-auto">
                <CartButton onOpenCart={onOpenCart} />
            </div>
        </header>
    )
}
