import { describe, it, expect } from 'vitest'
import { filterProducts } from './filterProducts'
import type { Product } from '../types/product'

const make = (id: string, name: string, category: Product['category'], description?: string): Product =>
    ({ id, name, category, description, image: '', variants: [{ id: 'v', label: 'One', price: 1000, inStock: true }] })

const products = [
    make('1', 'Night Cream', 'skincare', 'Rich moisturiser'),
    make('2', 'Rose Perfume', 'fragrance'),
    make('3', 'Eye-liner', 'makeup', 'Waterproof black liner'),
]

describe('filterProducts', () => {
    it('returns everything with no category and an empty search', () => {
        expect(filterProducts(products, { category: null, query: '' })).toHaveLength(3)
    })

    it('filters by category', () => {
        const result = filterProducts(products, { category: 'makeup', query: '' })
        expect(result.map(p => p.id)).toEqual(['3'])
    })

    it('matches the name case-insensitively', () => {
        const result = filterProducts(products, { category: null, query: '  ROSE ' })
        expect(result.map(p => p.id)).toEqual(['2'])
    })

    it('matches the description', () => {
        const result = filterProducts(products, { category: null, query: 'waterproof' })
        expect(result.map(p => p.id)).toEqual(['3'])
    })

    it('combines category and search', () => {
        expect(filterProducts(products, { category: 'skincare', query: 'liner' })).toEqual([])
    })
})
