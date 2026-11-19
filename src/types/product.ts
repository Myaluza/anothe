export const CATEGORIES = ['skincare', 'makeup', 'fragrance'] as const

export type Category = typeof CATEGORIES[number]

// One buyable option of a product, e.g. a size ("100ml") or a shade ("Black").
export interface ProductVariant {
    id: string
    label: string
    price: number // price is stored in cents (ZAR). e.g. 15000 = R150,00
    inStock: boolean
}

export interface Product {
    id: string
    slug: string // used in the product page address, e.g. /product/eye-liner
    name: string
    category: Category
    image: string
    description?: string
    variants: ProductVariant[] // at least one
}
