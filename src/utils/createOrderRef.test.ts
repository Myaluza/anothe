import { describe, it, expect } from 'vitest'
import { createOrderRef } from './createOrderRef'

describe('createOrderRef', () => {
    it('has the ANO- prefix and 7 upper-case letters or digits', () => {
        expect(createOrderRef()).toMatch(/^ANO-[0-9A-Z]{7}$/)
    })

    it('keeps the format at the edges of the random range', () => {
        expect(createOrderRef(0, () => 0)).toBe('ANO-0000000')
        expect(createOrderRef(1795093884303, () => 0.9999999)).toMatch(/^ANO-[0-9A-Z]{4}ZZZ$/)
    })

    it('differs when the time or the random part differs', () => {
        const now = 1795093884303
        expect(createOrderRef(now, () => 0.1)).not.toBe(createOrderRef(now, () => 0.2))
        expect(createOrderRef(now, () => 0.1)).not.toBe(createOrderRef(now + 1, () => 0.1))
    })
})
