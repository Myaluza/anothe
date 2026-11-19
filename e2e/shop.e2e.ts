import { products } from '../src/data/products'
import { formatCurrency } from '../src/utils/formatCurrency'
import { addToCart, expect, productCard, test } from './fixtures'

const multiOption = products.find(p => p.variants.length > 1 && p.variants.every(v => v.inStock))!
const withSoldOut = products.find(p => p.variants.some(v => !v.inStock) && p.variants.some(v => v.inStock))

test('shows every product', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('article')).toHaveCount(products.length)
})

test('filters by category and keeps the filter in a shareable link', async ({ page }) => {
    const category = products[0].category
    const inCategory = products.filter(p => p.category === category)

    await page.goto('/')
    await page.getByRole('group', { name: 'Filter by category' }).getByRole('button', { name: category }).click()
    await expect(page).toHaveURL(new RegExp(`category=${category}`))
    await expect(page.locator('article')).toHaveCount(inCategory.length)

    // Opening the link directly shows the same result.
    await page.goto(`/?category=${category}`)
    await expect(page.locator('article')).toHaveCount(inCategory.length)
    await expect(page.getByRole('button', { name: category })).toHaveAttribute('aria-pressed', 'true')
})

test('searches, and offers to clear filters when nothing matches', async ({ page }) => {
    await page.goto('/')
    const search = page.getByRole('searchbox', { name: 'Search products' })

    await search.fill(products[1].name)
    await expect(page).toHaveURL(/q=/)
    await expect(productCard(page, products[1].name)).toBeVisible()

    await search.fill('zzzz-no-such-product')
    await expect(page.getByText('No products match your search.')).toBeVisible()
    await page.getByRole('button', { name: 'Clear filters' }).click()
    await expect(page.locator('article')).toHaveCount(products.length)
})

test('product page: choosing a size changes the price', async ({ page }) => {
    await page.goto(`/product/${multiOption.slug}`)
    await expect(page.getByRole('heading', { level: 1, name: multiOption.name })).toBeVisible()
    await expect(page.getByText(formatCurrency(multiOption.variants[0].price)).first()).toBeVisible()

    const second = multiOption.variants[1]
    await page.getByLabel(`Choose an option for ${multiOption.name}`).selectOption(second.id)
    await expect(page.locator('main').getByText(formatCurrency(second.price), { exact: true })).toBeVisible()
})

test('product page: sold-out options cannot be chosen', async ({ page }) => {
    test.skip(!withSoldOut, 'No product currently has a sold-out option')
    await page.goto(`/product/${withSoldOut!.slug}`)
    const soldOut = withSoldOut!.variants.find(v => !v.inStock)!
    await expect(page.locator(`option[value="${soldOut.id}"]`)).toBeDisabled()
})

test('quantity picker on a product card adds that many', async ({ page }) => {
    const product = products.find(p => p.variants[0].inStock)!
    await page.goto('/')
    const card = productCard(page, product.name)
    await card.getByRole('button', { name: `Increase quantity of ${product.name}` }).click()
    await card.getByRole('button', { name: `Increase quantity of ${product.name}` }).click()
    await addToCart(page, product.name)
    await expect(page.getByRole('banner').getByText('Cart (3)').first()).toBeAttached()
})

test('unknown pages and products show "Page not found"', async ({ page }) => {
    for (const path of ['/no-such-page', '/product/no-such-product']) {
        await page.goto(path)
        await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
        await page.getByRole('link', { name: 'Back to the shop' }).click()
        await expect(page.locator('article').first()).toBeVisible()
    }
})

test('a link to the privacy notice opens at that section', async ({ page }) => {
    await page.goto('/about#privacy')
    await expect(page.getByRole('heading', { name: 'Privacy' })).toBeInViewport()
})
