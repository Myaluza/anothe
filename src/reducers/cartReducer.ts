import type { CartItem, CartAction } from "../types/cart";

export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
    function removeItem(state: CartItem[], productId: string): CartItem[] {
        return state.filter(item => item.product.id !== productId);
    }

    switch (action.type) {
        case 'ADD': {
            const existing = state.find(item => item.product.id === action.product.id)
            if (existing) {
                return state.map(item =>
                    item.product.id === action.product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            return [...state, { product: action.product, quantity: 1 }]
        }
        case 'REMOVE':
            return removeItem(state, action.productId)
        case 'UPDATE_QUANTITY':
            if (action.quantity < 1) {
                return removeItem(state, action.productId)
            }
            return state.map(item =>
                item.product.id === action.productId
                    ? { ...item, quantity: action.quantity}
                    : item
            )
        case 'CLEAR':
            return []
    }
}