// The most recent order, kept for this browser tab so the confirmation page can
// show the reference and offer to reopen or copy the WhatsApp message.

export interface LastOrder {
    ref: string
    name: string
    message: string
    totalCents: number
    whatsappUrl: string
}

const KEY = 'anothe-last-order'

export function saveLastOrder(order: LastOrder) {
    try {
        sessionStorage.setItem(KEY, JSON.stringify(order))
    } catch {
        // Storage can be unavailable (private mode, blocked site data); the confirmation page then redirects home.
    }
}

export function loadLastOrder(): LastOrder | null {
    try {
        const raw = sessionStorage.getItem(KEY)
        if (raw === null) {
            return null
        }
        const data = JSON.parse(raw)
        const valid = typeof data?.ref === 'string'
            && typeof data?.name === 'string'
            && typeof data?.message === 'string'
            && typeof data?.totalCents === 'number'
            && typeof data?.whatsappUrl === 'string'
        return valid ? data as LastOrder : null
    } catch {
        return null
    }
}
