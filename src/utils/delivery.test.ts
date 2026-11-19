import { describe, it, expect } from 'vitest'
import { deliveryFee } from './delivery'
import { DELIVERY_FEE_CENTS } from '../config'

describe('deliveryFee', () => {
    it('charges the standard fee for delivery', () => {
        expect(deliveryFee('delivery')).toBe(DELIVERY_FEE_CENTS)
        expect(deliveryFee('delivery', 5000)).toBe(5000)
    })

    it('is free for collection', () => {
        expect(deliveryFee('collection')).toBe(0)
    })
})
