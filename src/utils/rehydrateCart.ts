import type { CartItem } from "../types/cart";
import type { Product } from "../types/product";

// Rebuilds a cart saved in localStorage against the current product list, so a
// returning customer always sees today's prices and never orders a product that
// has been removed or sold out.
export function rehydrateCart(saved: unknown, products: Product[]): CartItem[] {
    if (!Array.isArray(saved)) {
        return []
    }

    const items: CartItem[] = []

    for (const entry of saved) {
        const id = entry?.product?.id
        const quantity = entry?.quantity
        const product = products.find(p => p.id === id)

        if (!product || !product.inStock) {
            continue
        }
        if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1) {
            continue
        }

        items.push({ product, quantity })
    }

    return items
}
