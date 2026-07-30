import type { CartItem } from "../types/cart";
import { formatCurrency } from "./formatCurrency";

export function buildOrderMessage(items: CartItem[]): string {
    const total = items.reduce((sum, item) => sum + (item.quantity * item.product.price), 0)
    const formatted = formatCurrency(total)

    const order = items.map(item => `${item.quantity} x ${item.product.name} — ${formatCurrency(item.quantity * item.product.price)}`)
    return `New order from Anothe\n\n${order.join('\n')}\n\nTotal: ${formatted}`
}