import { DELIVERY_AREAS, type DeliveryArea } from "../config";
import type { CustomerDetails } from "../types/customer";

export function findArea(areaId: string, areas: DeliveryArea[] = DELIVERY_AREAS): DeliveryArea | undefined {
    return areas.find(a => a.id === areaId)
}

// Delivery fee in cents for these checkout details: 0 for collection or when no area is chosen yet.
export function deliveryFee(details: Pick<CustomerDetails, 'fulfilment' | 'areaId'>, areas: DeliveryArea[] = DELIVERY_AREAS): number {
    if (details.fulfilment !== 'delivery') {
        return 0
    }
    return findArea(details.areaId, areas)?.feeCents ?? 0
}
