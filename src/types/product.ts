export interface Product  {
    id: string
    name: string
    price: number // price is stored in cents (ZAR). e.g. 15000 = R150,00
    category: 'skincare' | 'makeup' | 'fragrance'
    image: string
    inStock: boolean
    description?: string
    variant?: string
}

export const productsArray: Product[] = [
    {
        id: '1',
        name: 'cream',
        price: 15000,
        category: 'skincare',
        image: "/images/cream.jpg",
        inStock: true,
        description: "skin cream",
        variant: "100ml"
    },
    {
        id: '2',
        name: 'perfume',
        price: 20000,
        category: 'fragrance',
        image: "/images/perfume.jpg",
        inStock: true,
        description: "perfume",
        variant: "100ml"
    },
    {
        id: '3',
        name: 'eye-liner',
        price: 15000,
        category: 'makeup',
        image: "/images/liner.jpg",
        inStock: false,
        description: "eye-liner",
        variant: "50ml"
    },
]