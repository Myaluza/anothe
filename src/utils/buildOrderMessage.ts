import type { CartItem } from "../types/cart";
import type { CustomerDetails } from "../types/customer";
import { formatCurrency } from "./formatCurrency";
import { cartTotal, lineTotal } from "./cartTotals";
import { deliveryFee } from "./delivery";
import { COLLECTION, SHOP_NAME } from "../config";

export function buildOrderMessage(items: CartItem[], details: CustomerDetails, orderRef?: string): string {
    const order = items.map(item =>
        `${item.quantity} x ${item.product.name} (${item.variant.label}) — ${formatCurrency(lineTotal(item))}`
    )

    const subtotal = cartTotal(items)
    const fee = deliveryFee(details.fulfilment)
    const isDelivery = details.fulfilment === 'delivery'

    const totals = [
        `Subtotal: ${formatCurrency(subtotal)}`,
        isDelivery ? `Delivery: ${formatCurrency(fee)}` : 'Collection: free',
        `Total: ${formatCurrency(subtotal + fee)}`,
    ]

    const customer = [
        `Name: ${details.name}`,
        `Phone: ${details.phone}`,
        isDelivery
            ? `Deliver to: ${details.address}`
            : `Collect from: ${COLLECTION.address}`,
        ...(details.note ? [`Note: ${details.note}`] : []),
    ]

    return [
        orderRef ? `New order from ${SHOP_NAME}\nOrder ref: ${orderRef}` : `New order from ${SHOP_NAME}`,
        order.join('\n'),
        totals.join('\n'),
        customer.join('\n'),
    ].join('\n\n')
}
