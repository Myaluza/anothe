import { describe, it, expect } from 'vitest'
import { buildOrderMessage } from './buildOrderMessage'
import { formatCurrency } from './formatCurrency'
import type { CartItem } from '../types/cart'
import type { Product } from '../types/product'
import type { CustomerDetails } from '../types/customer'
import { COLLECTION, DELIVERY_FEE_CENTS } from '../config'

const liner: Product = {
    id: '3', slug: 'eye-liner', name: 'eye-liner', category: 'makeup', image: '',
    variants: [
        { id: 'black', label: 'Black', price: 15000, inStock: true },
        { id: 'brown', label: 'Brown', price: 15000, inStock: true },
    ],
}

const items: CartItem[] = [
    { product: liner, variant: liner.variants[0], quantity: 2 },
    { product: liner, variant: liner.variants[1], quantity: 1 },
]

const delivery: CustomerDetails = {
    name: 'Thuthu', phone: '0681234567', fulfilment: 'delivery', address: '12 Example Road, Umhlanga',
}

describe('buildOrderMessage', () => {
    it('lists each line with its variant', () => {
        const message = buildOrderMessage(items, delivery)
        expect(message).toContain(`2 x eye-liner (Black) — ${formatCurrency(30000)}`)
        expect(message).toContain(`1 x eye-liner (Brown) — ${formatCurrency(15000)}`)
    })

    it('adds the delivery fee to the total and includes the address', () => {
        const message = buildOrderMessage(items, delivery)
        expect(message).toContain(`Subtotal: ${formatCurrency(45000)}`)
        expect(message).toContain(`Delivery: ${formatCurrency(DELIVERY_FEE_CENTS)}`)
        expect(message).toContain(`Total: ${formatCurrency(45000 + DELIVERY_FEE_CENTS)}`)
        expect(message).toContain('Deliver to: 12 Example Road, Umhlanga')
        expect(message).toContain('Name: Thuthu')
        expect(message).not.toContain('Note:')
    })

    it('includes the order reference when given', () => {
        expect(buildOrderMessage(items, delivery, 'ANO-ABC1234')).toContain('Order ref: ANO-ABC1234')
        expect(buildOrderMessage(items, delivery)).not.toContain('Order ref')
    })

    it('charges nothing for collection and shows the collection address', () => {
        const message = buildOrderMessage(items, { ...delivery, fulfilment: 'collection', note: 'After 5pm' })
        expect(message).toContain('Collection: free')
        expect(message).toContain(`Total: ${formatCurrency(45000)}`)
        expect(message).toContain(`Collect from: ${COLLECTION.address}`)
        expect(message).not.toContain('Deliver to:')
        expect(message).toContain('Note: After 5pm')
    })
})
