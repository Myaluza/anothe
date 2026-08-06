import { describe, it, expect } from 'vitest'
import { validateCheckout} from './validateCheckout'
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