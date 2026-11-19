import type { Product } from "../types/product";

// Placeholder products. Prices are in cents (ZAR), e.g. 15000 = R150,00.
// Product photos live in /public/images.
export const products: Product[] = [
    {
        id: '1',
        name: 'cream',
        price: 15000,
        category: 'skincare',
        image: "/images/cream.svg",
        inStock: true,
        description: "skin cream",
        variant: "100ml"
    },
    {
        id: '2',
        name: 'perfume',
        price: 20000,
        category: 'fragrance',
        image: "/images/perfume.svg",
        inStock: true,
        description: "perfume",
        variant: "100ml"
    },
    {
        id: '3',
        name: 'eye-liner',
        price: 15000,
        category: 'makeup',
        image: "/images/liner.svg",
        inStock: false,
        description: "eye-liner",
        variant: "50ml"
    },
]
