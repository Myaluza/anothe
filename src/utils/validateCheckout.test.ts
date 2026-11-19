import { describe, it, expect } from 'vitest'
import { validateCheckout, isValidSouthAfricanPhone, FIELD_LIMITS } from './validateCheckout'
import type { CustomerDetails } from '../types/customer'

const validDelivery: CustomerDetails = {
    name: 'Thuthu',
    phone: '0681234567',
    fulfilment: 'delivery',
    address: '12 Example Road',
    note: 'Leave at the door',
}

describe('validateCheckout', () => {
    it('returns errors for every required delivery field when empty', () => {
        const errors = validateCheckout({ name: '', phone: '', fulfilment: 'delivery', address: '' })
        expect(Object.keys(errors).sort()).toEqual(['address', 'name', 'phone'])
    })

    it('returns no errors for a complete delivery order', () => {
        expect(validateCheckout(validDelivery)).toEqual({})
    })

    it('returns errors when filled with whitespace', () => {
        const errors = validateCheckout({ ...validDelivery, name: '   ', address: '  ' })
        expect(errors.name).toBeDefined()
        expect(errors.address).toBeDefined()
    })

    it('does not need an address for collection', () => {
        const errors = validateCheckout({ ...validDelivery, fulfilment: 'collection', address: '' })
        expect(errors).toEqual({})
    })
})

describe('isValidSouthAfricanPhone', () => {
    it.each(['0681234567', '082 123 4567', '+27 82 123 4567', '27821234567', '(011) 123-4567'])('accepts %s', phone => {
        expect(isValidSouthAfricanPhone(phone)).toBe(true)
    })

    it.each(['12345', '08212345678', '+44 20 7946 0958', 'phone'])('rejects %s', phone => {
        expect(isValidSouthAfricanPhone(phone)).toBe(false)
    })

    it('gives a phone error for an invalid number', () => {
        const errors = validateCheckout({ ...validDelivery, phone: '12345' })
        expect(errors.phone).toBeDefined()
    })
})

describe('validateCheckout length limits', () => {
    it('accepts values exactly at each limit', () => {
        expect(validateCheckout({
            ...validDelivery,
            name: 'a'.repeat(FIELD_LIMITS.name),
            address: 'a'.repeat(FIELD_LIMITS.address),
            note: 'a'.repeat(FIELD_LIMITS.note),
        })).toEqual({})
    })

    it('rejects values one character over each limit', () => {
        const errors = validateCheckout({
            ...validDelivery,
            name: 'a'.repeat(FIELD_LIMITS.name + 1),
            address: 'a'.repeat(FIELD_LIMITS.address + 1),
            note: 'a'.repeat(FIELD_LIMITS.note + 1),
        })
        expect(Object.keys(errors).sort()).toEqual(['address', 'name', 'note'])
    })

    it('rejects an over-long phone even if its digits look valid', () => {
        const padded = '082 123 4567' + ' '.repeat(FIELD_LIMITS.phone)
        expect(validateCheckout({ ...validDelivery, phone: padded }).phone).toBeDefined()
    })

    it('ignores the address limit for collection orders', () => {
        const errors = validateCheckout({ ...validDelivery, fulfilment: 'collection', address: 'a'.repeat(FIELD_LIMITS.address + 1) })
        expect(errors).toEqual({})
    })
})
