import type { CartItem } from "../types/cart";
import type { Product } from "../types/product";
import { findVariant } from "./productHelpers";

// Rebuilds a cart saved in localStorage against the current product list, so a
// returning customer always sees today's prices and never orders a product or
// option that has been removed or sold out. Items saved by older versions of
// the site (before products had variants) are dropped.
export function rehydrateCart(saved: unknown, products: Product[]): CartItem[] {
    if (!Array.isArray(saved)) {
        return []
    }

    const items: CartItem[] = []

    for (const entry of saved) {
        const productId = entry?.product?.id
        const variantId = entry?.variant?.id
        const quantity = entry?.quantity

        const product = products.find(p => p.id === productId)
        const variant = product && typeof variantId === 'string' ? findVariant(product, variantId) : undefined

        if (!product || !variant || !variant.inStock) {
            continue
        }
        if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1) {
            continue
        }

        items.push({ product, variant, quantity })
    }

    return items
}
