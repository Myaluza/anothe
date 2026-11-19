import { describe, it, expect } from 'vitest'
import { rehydrateCart } from './rehydrateCart'
import type { Product } from '../types/product'

const cream: Product = { id: '1', name: 'cream', price: 15000, category: 'skincare', image: '/images/cream.svg', inStock: true }
const liner: Product = { id: '3', name: 'eye-liner', price: 15000, category: 'makeup', image: '/images/liner.svg', inStock: false }
const products = [cream, liner]

describe('rehydrateCart', () => {
    it('uses the current product data instead of the saved snapshot', () => {
        const saved = [{ product: { ...cream, price: 9900 }, quantity: 2 }]
        const items = rehydrateCart(saved, products)

        expect(items).toEqual([{ product: cream, quantity: 2 }])
    })

    it('drops products that no longer exist', () => {
        const saved = [{ product: { id: 'gone' }, quantity: 1 }]
        expect(rehydrateCart(saved, products)).toEqual([])
    })

    it('drops products that are out of stock', () => {
        const saved = [{ product: liner, quantity: 1 }]
        expect(rehydrateCart(saved, products)).toEqual([])
    })

    it('drops items with an invalid quantity', () => {
        const saved = [
            { product: cream, quantity: 0 },
            { product: cream, quantity: 1.5 },
            { product: cream, quantity: '2' },
        ]
        expect(rehydrateCart(saved, products)).toEqual([])
    })

    it('returns an empty cart for data that is not an array', () => {
        expect(rehydrateCart(null, products)).toEqual([])
        expect(rehydrateCart({ items: [] }, products)).toEqual([])
    })
})
