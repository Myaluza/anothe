import type { Category, Product } from "../types/product";

export interface ProductFilters {
    category: Category | null
    query: string
}

// Keeps products in the chosen category (all when null) whose name or
// description contains the search text, ignoring case and extra spaces.
export function filterProducts(products: Product[], { category, query }: ProductFilters): Product[] {
    const search = query.trim().toLowerCase()

    return products.filter(product => {
        if (category && product.category !== category) {
            return false
        }
        if (search === '') {
            return true
        }
        const haystack = `${product.name} ${product.description ?? ''}`.toLowerCase()
        return haystack.includes(search)
    })
}
