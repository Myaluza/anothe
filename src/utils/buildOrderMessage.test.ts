import { describe, it, expect } from 'vitest'
import { buildOrderMessage } from './buildOrderMessage'
import { formatCurrency } from './formatCurrency'
import type { CartItem } from '../types/cart'
import type { Product } from '../types/product'

const liner: Product = {
    id: '3', name: 'eye-liner', category: 'makeup', image: '',
    variants: [
        { id: 'black', label: 'Black', price: 15000, inStock: true },
        { id: 'brown', label: 'Brown', price: 15000, inStock: true },
    ],
}

describe('buildOrderMessage', () => {
    it('lists each line with its variant, the total and the customer details', () => {
        const items: CartItem[] = [
            { product: liner, variant: liner.variants[0], quantity: 2 },
            { product: liner, variant: liner.variants[1], quantity: 1 },
        ]
        const message = buildOrderMessage(items, { name: 'Thuthu', phone: '0681234567', area: 'Durban' })

        expect(message).toContain(`2 x eye-liner (Black) — ${formatCurrency(30000)}`)
        expect(message).toContain(`1 x eye-liner (Brown) — ${formatCurrency(15000)}`)
        expect(message).toContain(`Total: ${formatCurrency(45000)}`)
        expect(message).toContain('Name: Thuthu')
        expect(message).not.toContain('Note:')
    })
})
