export type Fulfilment = 'delivery' | 'collection'

export interface CustomerDetails {
    name: string
    phone: string
    fulfilment: Fulfilment
    address: string // delivery only: street address
    note?: string
}

export type FormErrors = {
    name?: string
    phone?: string
    address?: string
    note?: string
}
