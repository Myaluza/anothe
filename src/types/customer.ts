export type Fulfilment = 'delivery' | 'collection'

export interface CustomerDetails {
    name: string
    phone: string
    fulfilment: Fulfilment
    areaId: string // delivery only: id from DELIVERY_AREAS
    address: string // delivery only: street address
    note?: string
}

export type FormErrors = {
    name?: string
    phone?: string
    areaId?: string
    address?: string
}
