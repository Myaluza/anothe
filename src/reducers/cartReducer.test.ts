import { it, describe, expect } from "vitest";
import { cartReducer } from "./cartReducer";
import type { Product } from "../types/product";

const testProduct: Product = {
    id: '1',
    name: 'cream',
    category: 'skincare',
    image: '/images/cream.svg',
    variants: [
        { id: '50ml', label: '50ml', price: 9000, inStock: true },
        { id: '100ml', label: '100ml', price: 15000, inStock: true },
    ],
}
const [small, large] = testProduct.variants

describe('cartReducer', () => {
    it('adds one line when an item is added to the cart', () => {
        const state = cartReducer([], { type: 'ADD', product: testProduct, variant: small })
        expect(state).toHaveLength(1)
    })

    it('increases the quantity when the same variant is added twice', () => {
        const afterFirst = cartReducer([], { type: 'ADD', product: testProduct, variant: small })
        const afterSecond = cartReducer(afterFirst, { type: 'ADD', product: testProduct, variant: small })
        expect(afterSecond).toHaveLength(1)
        expect(afterSecond[0].quantity).toBe(2)
    })

    it('keeps different variants of the same product on separate lines', () => {
        const afterFirst = cartReducer([], { type: 'ADD', product: testProduct, variant: small })
        const afterSecond = cartReducer(afterFirst, { type: 'ADD', product: testProduct, variant: large })
        expect(afterSecond.map(item => item.variant.id)).toEqual(['50ml', '100ml'])
    })

    it('removes only the matching variant', () => {
        let state = cartReducer([], { type: 'ADD', product: testProduct, variant: small })
        state = cartReducer(state, { type: 'ADD', product: testProduct, variant: large })
        state = cartReducer(state, { type: 'REMOVE', productId: '1', variantId: '50ml' })
        expect(state.map(item => item.variant.id)).toEqual(['100ml'])
    })

    it('updates the quantity of a line', () => {
        const afterFirst = cartReducer([], { type: 'ADD', product: testProduct, variant: small })
        const afterSecond = cartReducer(afterFirst, { type: 'UPDATE_QUANTITY', productId: '1', variantId: '50ml', quantity: 5 })
        expect(afterSecond[0].quantity).toEqual(5)
    })

    it('removes a line when its quantity is updated to 0', () => {
        const afterFirst = cartReducer([], { type: 'ADD', product: testProduct, variant: small })
        const afterSecond = cartReducer(afterFirst, { type: 'UPDATE_QUANTITY', productId: '1', variantId: '50ml', quantity: 0 })
        expect(afterSecond).toEqual([])
    })

    it('empties the cart when it is cleared', () => {
        const afterFirst = cartReducer([], { type: 'ADD', product: testProduct, variant: small })
        expect(cartReducer(afterFirst, { type: 'CLEAR' })).toEqual([])
    })
})
