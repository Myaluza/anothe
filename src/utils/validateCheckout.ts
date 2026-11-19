import type { CustomerDetails, FormErrors } from "../types/customer";

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
    }
    if (details.phone.trim() === '') {
        errors.phone = "Please enter your phone number"
    } else if (!isValidSouthAfricanPhone(details.phone)) {
        errors.phone = "Please enter a valid phone number, e.g. 082 123 4567"
    }
    if (details.area.trim() === '') {
        errors.area = "Please enter your delivery area"
    }

    return errors
}
