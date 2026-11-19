import { describe, it, expect } from 'vitest'
import { rehydrateCart } from './rehydrateCart'
import type { Product } from '../types/product'

const cream: Product = {
    id: '1', name: 'cream', category: 'skincare', image: '/images/cream.svg',
    variants: [
        { id: '50ml', label: '50ml', price: 9000, inStock: true },
        { id: '100ml', label: '100ml', price: 15000, inStock: false },
    ],
}
const products = [cream]
const [small, large] = cream.variants

describe('rehydrateCart', () => {
    it('uses the current product and variant data instead of the saved snapshot', () => {
        const saved = [{ product: { ...cream, name: 'old name' }, variant: { ...small, price: 1 }, quantity: 2 }]
        expect(rehydrateCart(saved, products)).toEqual([{ product: cream, variant: small, quantity: 2 }])
    })

    it('drops products that no longer exist', () => {
        const saved = [{ product: { id: 'gone' }, variant: small, quantity: 1 }]
        expect(rehydrateCart(saved, products)).toEqual([])
    })

    it('drops variants that no longer exist', () => {
        const saved = [{ product: cream, variant: { id: '200ml' }, quantity: 1 }]
        expect(rehydrateCart(saved, products)).toEqual([])
    })

    it('drops variants that are out of stock', () => {
        const saved = [{ product: cream, variant: large, quantity: 1 }]
        expect(rehydrateCart(saved, products)).toEqual([])
    })

    it('drops items saved before products had variants', () => {
        const saved = [{ product: { id: '1', price: 15000 }, quantity: 1 }]
        expect(rehydrateCart(saved, products)).toEqual([])
    })

    it('drops items with an invalid quantity', () => {
        const saved = [
            { product: cream, variant: small, quantity: 0 },
            { product: cream, variant: small, quantity: 1.5 },
            { product: cream, variant: small, quantity: '2' },
        ]
        expect(rehydrateCart(saved, products)).toEqual([])
    })

    it('returns an empty cart for data that is not an array', () => {
        expect(rehydrateCart(null, products)).toEqual([])
        expect(rehydrateCart({ items: [] }, products)).toEqual([])
    })
})
