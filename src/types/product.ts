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
