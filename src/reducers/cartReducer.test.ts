import { it, describe, expect } from "vitest";
import { cartReducer } from "./cartReducer";
import type { Product } from "../types/product";

const testProduct: Product = {
    id: '1',
    name: 'cream',
    price: 15000,
    category: 'skincare',
    image: '/images/cream.jpg',
    inStock: true
}

describe('cartReducer', () => {
    it('return 1 if 1 item is added to the cart', () => {
        const state = cartReducer([], { type: 'ADD', product: testProduct })
        expect(state).toHaveLength(1)
    })

    it('return 2 if 2 item is added to the cart', () => {
        const afterFirst = cartReducer([], { type: 'ADD', product: testProduct })
        const afterSecond = cartReducer(afterFirst, { type: 'ADD', product: testProduct })
        expect(afterSecond).toHaveLength(1)
        expect(afterSecond[0].quantity).toBe(2)
    })

    it('returns empty if an item is removed from 1-item cart', () => {
        const afterFirst = cartReducer([], { type: 'ADD', product: testProduct })
        const afterSecond = cartReducer(afterFirst, { type: 'REMOVE', productId: testProduct.id})
        expect(afterSecond).toEqual([])
    })

    it('returns 5 when the quantity is updated to 5', () => {
        const afterFirst = cartReducer([], { type: 'ADD', product: testProduct })
        const afterSecond = cartReducer(afterFirst, { type: 'UPDATE_QUANTITY', productId: testProduct.id, quantity: 5})
        expect(afterSecond[0].quantity).toEqual(5)
    })

    it('product disappears from cart when the quantity is updated to 0', () => {
        const afterFirst = cartReducer([], { type: 'ADD', product: testProduct })
        const afterSecond = cartReducer(afterFirst, { type: 'UPDATE_QUANTITY', productId: testProduct.id, quantity: 0})
        expect(afterSecond).toEqual([])
    })

    it('cart is empty when it is cleared', () => {
        const afterFirst = cartReducer([], { type: 'ADD', product: testProduct })
        const afterSecond = cartReducer(afterFirst, { type: 'CLEAR'})
        expect(afterSecond).toEqual([])
    })
})

