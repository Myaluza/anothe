import { describe, it, expect } from 'vitest'
import { validateCheckout, isValidSouthAfricanPhone } from './validateCheckout'
import type { CustomerDetails } from '../types/customer'



describe('validateCheckout', () => {
    it('returns errors when all fields are empty', () => {
        const emptyDetails: CustomerDetails = { name: '', phone: '', area: '', note: '' }
        const errors = validateCheckout(emptyDetails)

        expect(Object.keys(errors)).toHaveLength(3)
    })

    it('returns no errors if all fields are filled', () => {
        const filledDetails: CustomerDetails = { name: 'Thuthu', phone: '0681234567', area: 'Durban', note: 'Leave at the door' }
        const errors = validateCheckout(filledDetails)

        expect(errors).toEqual({})
    })

    it('returns errors when filled with whitespace', () => {
        const whitespaceDetails: CustomerDetails = { name: '   ', phone: '0681234567', area: 'Durban', note: 'Leave at the door' }
        const errors = validateCheckout(whitespaceDetails)

        expect(errors.name).toBeDefined()
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
        const errors = validateCheckout({ name: 'Thuthu', phone: '12345', area: 'Durban' })
        expect(errors.phone).toBeDefined()
    })
})
