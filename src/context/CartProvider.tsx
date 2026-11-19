import { useEffect, useReducer, type ReactNode } from "react";
import type { CartItem } from "../types/cart";
import { cartReducer } from "../reducers/cartReducer";
import { CartContext } from "./useCart";
import { products } from "../data/products";
import { rehydrateCart } from "../utils/rehydrateCart";

function loadCart(): CartItem[] {
    try {
        const data = localStorage.getItem('anothe-cart')
        if (data === null) {
            return []
        }
        return rehydrateCart(JSON.parse(data), products)
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
