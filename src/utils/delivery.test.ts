import { describe, it, expect } from 'vitest'
import { deliveryFee, findArea } from './delivery'

const areas = [
    { id: 'a', name: 'Area A', feeCents: 5000 },
    { id: 'b', name: 'Area B', feeCents: 7500 },
]

describe('deliveryFee', () => {
    it('charges the chosen area fee for delivery', () => {
        expect(deliveryFee({ fulfilment: 'delivery', areaId: 'b' }, areas)).toBe(7500)
    })

    it('is free for collection', () => {
        expect(deliveryFee({ fulfilment: 'collection', areaId: 'b' }, areas)).toBe(0)
    })

    it('is 0 until an area is chosen', () => {
        expect(deliveryFee({ fulfilment: 'delivery', areaId: '' }, areas)).toBe(0)
    })
})

describe('findArea', () => {
    it('finds an area by id', () => {
        expect(findArea('a', areas)?.name).toBe('Area A')
        expect(findArea('zzz', areas)).toBeUndefined()
    })
})
