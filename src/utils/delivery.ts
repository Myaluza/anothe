import { DELIVERY_FEE_CENTS } from "../config";
import type { Fulfilment } from "../types/customer";

// Delivery fee in cents: the standard fee for delivery, free for collection.
export function deliveryFee(fulfilment: Fulfilment, fee: number = DELIVERY_FEE_CENTS): number {
    return fulfilment === 'delivery' ? fee : 0
}
