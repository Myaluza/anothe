export const SHOP_NAME = 'Anothe'

// WhatsApp number orders are sent to, in international format without "+" or spaces.
// TODO: replace this placeholder with the shop's real WhatsApp number before promoting the site.
export const WHATSAPP_NUMBER = '27821234567'

export interface DeliveryArea {
    id: string
    name: string
    feeCents: number // e.g. 6000 = R60,00
}

// Areas the shop delivers to and what each costs.
// TODO: placeholder areas and fees; replace with the real ones.
export const DELIVERY_AREAS: DeliveryArea[] = [
    { id: 'durban-central', name: 'Durban Central', feeCents: 6000 },
    { id: 'umhlanga', name: 'Umhlanga', feeCents: 8000 },
    { id: 'pinetown', name: 'Pinetown', feeCents: 9000 },
]

// Free collection. Set enabled to false if the shop doesn't offer it.
// TODO: placeholder address; replace with the real collection point.
export const COLLECTION = {
    enabled: true,
    address: 'Collection address to be confirmed',
    note: "We'll WhatsApp you when your order is ready to collect.",
}
