import type { Product, ProductVariant } from "../types/product";

export function isInStock(product: Product): boolean {
    return product.variants.some(v => v.inStock)
}

export function lowestPrice(product: Product): number {
    return Math.min(...product.variants.map(v => v.price))
}

export function findVariant(product: Product, variantId: string): ProductVariant | undefined {
    return product.variants.find(v => v.id === variantId)
}

// The option to preselect: the first one in stock, otherwise the first one.
export function defaultVariant(product: Product): ProductVariant {
    return product.variants.find(v => v.inStock) ?? product.variants[0]
}
