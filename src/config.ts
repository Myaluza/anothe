export const SHOP_NAME = 'Anothe'

// WhatsApp number orders are sent to, in international format without "+" or spaces.
// TODO: replace this placeholder with the shop's real WhatsApp number before promoting the site.
export const WHATSAPP_NUMBER = '27821234567'

// Most units a customer can add in one go from a product card or product page.
export const MAX_QUANTITY_PER_ADD = 20

// One standard delivery fee for every delivered order, in cents (8000 = R80,00). Collection is free.
export const DELIVERY_FEE_CENTS = 8000

// Where the shop delivers, listed on the About page so customers know before ordering.
// TODO: placeholder areas; replace with the real ones.
export const DELIVERY_AREAS: string[] = ['Durban Central', 'Umhlanga', 'Pinetown']

// Free collection. Set enabled to false if the shop doesn't offer it.
// TODO: placeholder address; replace with the real collection point.
export const COLLECTION = {
    enabled: true,
    address: 'Collection address to be confirmed',
    note: "We'll WhatsApp you when your order is ready to collect.",
}
