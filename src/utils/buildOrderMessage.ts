import type { CartItem } from "../types/cart";
import type { CustomerDetails } from "../types/customer";
import { formatCurrency } from "./formatCurrency";
import { cartTotal, lineTotal } from "./cartTotals";
import { SHOP_NAME } from "../config";

export function buildOrderMessage(items: CartItem[], details: CustomerDetails): string {
    const order = items.map(item =>
        `${item.quantity} x ${item.product.name} (${item.variant.label}) — ${formatCurrency(lineTotal(item))}`
    )
    const customer = `Name: ${details.name}\nPhone: ${details.phone}\nArea: ${details.area}${details.note ? `\nNote: ${details.note}` : ''}`
    return `New order from ${SHOP_NAME}\n\n${order.join('\n')}\n\nTotal: ${formatCurrency(cartTotal(items))}\n\n${customer}`
}
