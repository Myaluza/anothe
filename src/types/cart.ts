import type { Product } from "./product";

export interface CartItem {
    product: Product
    quantity: number
}

export type CartAction =
    | { type: 'ADD'; product: Product }
    | { type: 'REMOVE'; productId: string }
    | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
    | { type: 'CLEAR' };