import type { CartItem, CartAction } from "../types/cart";
import { isSameLine } from "../utils/cartTotals";

export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
    function removeItem(productId: string, variantId: string): CartItem[] {
        return state.filter(item => !isSameLine(item, productId, variantId))
    }

    switch (action.type) {
        case 'ADD': {
            const { product, variant } = action
            const existing = state.find(item => isSameLine(item, product.id, variant.id))
            if (existing) {
                return state.map(item =>
                    item === existing ? { ...item, quantity: item.quantity + 1 } : item
                )
            }
            return [...state, { product, variant, quantity: 1 }]
        }
        case 'REMOVE':
            return removeItem(action.productId, action.variantId)
        case 'UPDATE_QUANTITY':
            if (action.quantity < 1) {
                return removeItem(action.productId, action.variantId)
            }
            return state.map(item =>
                isSameLine(item, action.productId, action.variantId)
                    ? { ...item, quantity: action.quantity }
                    : item
            )
        case 'CLEAR':
            return []
    }
}
