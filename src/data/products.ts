import type { Product } from "../types/product";

// Placeholder products. Prices are in cents (ZAR), e.g. 15000 = R150,00.
// Product photos live in /public/images.
// Each product needs at least one variant (a size or shade). A product with a
// single variant shows a plain "Add to cart" button; with several, shoppers pick one.
export const products: Product[] = [
    {
        id: '1',
        name: 'cream',
        category: 'skincare',
        image: "/images/cream.svg",
        description: "skin cream",
        variants: [
            { id: '50ml', label: '50ml', price: 9000, inStock: true },
            { id: '100ml', label: '100ml', price: 15000, inStock: true },
        ],
    },
    {
        id: '2',
        name: 'perfume',
        category: 'fragrance',
        image: "/images/perfume.svg",
        description: "perfume",
        variants: [
            { id: '100ml', label: '100ml', price: 20000, inStock: true },
        ],
    },
    {
        id: '3',
        name: 'eye-liner',
        category: 'makeup',
        image: "/images/liner.svg",
        description: "eye-liner",
        variants: [
            { id: 'black', label: 'Black', price: 15000, inStock: true },
            { id: 'brown', label: 'Brown', price: 15000, inStock: false },
        ],
    },
]
