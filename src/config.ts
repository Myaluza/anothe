export const SHOP_NAME = 'Anothe'

// WhatsApp number orders are sent to, in international format without "+" or spaces.
// TODO: replace this placeholder with the shop's real WhatsApp number before promoting the site.
const DEFAULT_WHATSAPP_NUMBER = '27821234567'

// Uses `value` if it looks like a WhatsApp number (8 to 15 digits, spaces and "+" ignored),
// otherwise the default, so a typo in a setting can't break ordering.
export function resolveWhatsAppNumber(value: string | undefined, fallback = DEFAULT_WHATSAPP_NUMBER): string {
    const digits = (value ?? '').replace(/[\s+]/g, '')
    return /^\d{8,15}$/.test(digits) ? digits : fallback
}

// Can be set per environment with VITE_WHATSAPP_NUMBER in Vercel (e.g. a test number for
// preview deployments). It's read when the site is built, so redeploy after changing it.
export const WHATSAPP_NUMBER = resolveWhatsAppNumber(import.meta.env?.VITE_WHATSAPP_NUMBER)

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
