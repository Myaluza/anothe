import type { CustomerDetails, FormErrors } from "../types/customer";

export function validateCheckout(details: CustomerDetails): FormErrors {
    const errors: FormErrors = {}

    if (details.name.trim() === '') {
        errors.name = "Please enter your name"
    }
    if (details.phone.trim() === '') {
        errors.phone = "Please enter your phone number"
    }
    if (details.area.trim() === '') {
        errors.area = "Please enter your delivery area"
    }

    return errors
}