export const CATEGORIES = ['skincare', 'makeup', 'fragrance'] as const

export type Category = typeof CATEGORIES[number]

export interface Product  {
    id: string
    name: string
    price: number // price is stored in cents (ZAR). e.g. 15000 = R150,00
    category: Category
    image: string
    inStock: boolean
    description?: string
    variant?: string
}
