import { createContext, useContext, type Dispatch } from "react";
import type { CartAction, CartItem } from "../types/cart";

export interface CartContextValue {
    items: CartItem[]
    dispatch: Dispatch<CartAction>
}

export const CartContext = createContext<CartContextValue | undefined>(undefined)

export function useCart() {
    const context = useContext(CartContext)

    if (context === undefined) {
        throw new Error("useCart must be used inside a CartProvider")
    }

    return context
}
