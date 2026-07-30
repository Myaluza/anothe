import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from "react";
import type { CartAction, CartItem } from "../types/cart";
import { cartReducer } from "../reducers/cartReducer";

export interface CartContextValue {
    items: CartItem[]
    dispatch: Dispatch<CartAction>
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

function loadCart(): CartItem[] {
    try {
        const data = localStorage.getItem('anothe-cart')
        if (data === null) {
            return []
        }
        return JSON.parse(data) as CartItem[]
    }
    catch {
        return []
    }
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, dispatch] = useReducer(cartReducer, [], loadCart)

    useEffect(() => {
        localStorage.setItem('anothe-cart', JSON.stringify(items))
    }, [items])

    return (
        <CartContext.Provider value={{ items, dispatch }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)

    if (context === undefined) {
        throw new Error("useCart must be used inside a CartProvider")
    }

    return context
}