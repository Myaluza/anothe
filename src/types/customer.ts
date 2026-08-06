export interface CustomerDetails {
    name: string,
    phone: string,
    area: string,
    note?: string
}

export type FormErrors = {
    name?: string
    phone?: string
    area?: string
}