import type { CustomerDetails, FormErrors } from "../types/customer";

// Longest value each field accepts. The form uses these as maxLength too;
// they keep the WhatsApp link a sensible size.
export const FIELD_LIMITS = {
    name: 80,
    phone: 20,
    address: 200,
    note: 500,
} as const

// South African mobile/landline: 0XX XXX XXXX, or +27 / 27 followed by 9 digits.
// Spaces, dashes and brackets are ignored.
export function isValidSouthAfricanPhone(phone: string): boolean {
    const digits = phone.replace(/[\s\-()]/g, '')
    return /^0\d{9}$/.test(digits) || /^\+?27\d{9}$/.test(digits)
}

export function validateCheckout(details: CustomerDetails): FormErrors {
    const errors: FormErrors = {}

    if (details.name.trim() === '') {
        errors.name = "Please enter your name"
    } else if (details.name.length > FIELD_LIMITS.name) {
        errors.name = `Please keep your name under ${FIELD_LIMITS.name} characters`
    }
    if (details.phone.trim() === '') {
        errors.phone = "Please enter your phone number"
    } else if (details.phone.length > FIELD_LIMITS.phone || !isValidSouthAfricanPhone(details.phone)) {
        errors.phone = "Please enter a valid phone number, e.g. 082 123 4567"
    }
    if (details.fulfilment === 'delivery') {
        if (details.address.trim() === '') {
            errors.address = "Please enter your delivery address"
        } else if (details.address.length > FIELD_LIMITS.address) {
            errors.address = `Please keep the address under ${FIELD_LIMITS.address} characters`
        }
    }

    if ((details.note ?? "").length > FIELD_LIMITS.note) {
        errors.note = `Please keep the note under ${FIELD_LIMITS.note} characters`
    }

    return errors
}
