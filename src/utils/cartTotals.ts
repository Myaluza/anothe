import type { CartItem } from "../types/cart";

export function lineTotal(item: CartItem): number {
    return item.variant.price * item.quantity
}

export function cartTotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + lineTotal(item), 0)
}

export function cartCount(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.quantity, 0)
}

export function isSameLine(item: CartItem, productId: string, variantId: string): boolean {
    return item.product.id === productId && item.variant.id === variantId
}
