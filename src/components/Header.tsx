import { Link, NavLink } from "react-router";
import { SHOP_NAME } from "../config";

// Sits at the top-left; the fixed Cart button occupies the top-right corner, hence the right padding.
export default function Header() {
    const navClass = ({ isActive }: { isActive: boolean }) =>
        `hover:text-gold ${isActive ? 'text-espresso font-semibold underline underline-offset-4 decoration-gold' : 'text-cocoa'}`

    return (
        <header className="flex items-center gap-6 pr-36 mb-6 min-h-12">
            <Link to="/" className="text-2xl font-display text-gold">{SHOP_NAME}</Link>
            <nav aria-label="Main" className="flex gap-4 text-sm">
                <NavLink to="/" end className={navClass}>Shop</NavLink>
                <NavLink to="/about" className={navClass}>About</NavLink>
            </nav>
        </header>
    )
}
