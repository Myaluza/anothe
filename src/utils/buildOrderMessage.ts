import type { CartItem } from "../types/cart";
import type { CustomerDetails } from "../types/customer";
import { formatCurrency } from "./formatCurrency";

export function buildOrderMessage(items: CartItem[], details: CustomerDetails): string {
    const total = items.reduce((sum, item) => sum + (item.quantity * item.product.price), 0)
    const formatted = formatCurrency(total)

    const order = items.map(item => `${item.quantity} x ${item.product.name} — ${formatCurrency(item.quantity * item.product.price)}`)
    const customer = `Name: ${details.name}\nPhone: ${details.phone}\nArea: ${details.area}${details.note ? `\nNote: ${details.note}` : ''}`
    return `New order from Anothe\n\n${order.join('\n')}\n\nTotal: ${formatted}\n\n${customer}`

}