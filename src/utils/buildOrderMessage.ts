import type { CartItem } from "../types/cart";
import type { CustomerDetails } from "../types/customer";
import { formatCurrency } from "./formatCurrency";
import { cartTotal, lineTotal } from "./cartTotals";
import { deliveryFee, findArea } from "./delivery";
import { COLLECTION, SHOP_NAME } from "../config";

export function buildOrderMessage(items: CartItem[], details: CustomerDetails): string {
    const order = items.map(item =>
        `${item.quantity} x ${item.product.name} (${item.variant.label}) — ${formatCurrency(lineTotal(item))}`
    )

    const subtotal = cartTotal(items)
    const fee = deliveryFee(details)
    const isDelivery = details.fulfilment === 'delivery'
    const areaName = findArea(details.areaId)?.name ?? details.areaId

    const totals = [
        `Subtotal: ${formatCurrency(subtotal)}`,
        isDelivery ? `Delivery (${areaName}): ${formatCurrency(fee)}` : 'Collection: free',
        `Total: ${formatCurrency(subtotal + fee)}`,
    ]

    const customer = [
        `Name: ${details.name}`,
        `Phone: ${details.phone}`,
        isDelivery
            ? `Deliver to: ${details.address}, ${areaName}`
            : `Collect from: ${COLLECTION.address}`,
        ...(details.note ? [`Note: ${details.note}`] : []),
    ]

    return [
        `New order from ${SHOP_NAME}`,
        order.join('\n'),
        totals.join('\n'),
        customer.join('\n'),
    ].join('\n\n')
}
