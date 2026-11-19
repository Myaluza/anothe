import type { Product, ProductVariant } from "./product";

export interface CartItem {
    product: Product
    variant: ProductVariant
    quantity: number
}

export type CartAction =
    | { type: 'ADD'; product: Product; variant: ProductVariant; quantity?: number }
    | { type: 'REMOVE'; productId: string; variantId: string }
    | { type: 'UPDATE_QUANTITY'; productId: string; variantId: string; quantity: number }
    | { type: 'CLEAR' };
