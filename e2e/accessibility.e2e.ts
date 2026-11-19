import { products } from '../src/data/products'
import { addToCart, expect, expectAccessible, isMobile, test } from './fixtures'

// Every page and state a customer can reach, scanned for WCAG 2.2 A/AA problems
// at both desktop and phone sizes.
const product = products.find(p => p.variants[0].inStock)!

for (const path of ['/', `/?category=${product.category}`, `/product/${product.slug}`, '/about', '/checkout', '/no-such-page']) {
    test(`no accessibility problems on ${path}`, async ({ page }) => {
        await page.goto(path)
        await expect(page.locator('main')).not.toHaveAttribute('aria-busy', 'true')
        await expect(page.locator('main [aria-busy]')).toHaveCount(0)
        await expectAccessible(page)
    })
}

test('no accessibility problems in checkout with items and errors showing', async ({ page }) => {
    await page.goto('/')
    await addToCart(page, product.name)
    await page.goto('/checkout')
    await expectAccessible(page)

    await page.getByRole('button', { name: 'Order on WhatsApp' }).click()
    await expect(page.getByLabel('Name')).toBeFocused()
    await expectAccessible(page)
})

test('no accessibility problems on the order confirmation', async ({ page }) => {
    await page.goto('/')
    await addToCart(page, product.name)
    await page.goto('/checkout')
    await page.getByLabel('Name').fill('Test Buyer')
    await page.getByLabel('Phone').fill('0821234567')
    await page.getByLabel('Delivery address').fill('12 Example Road')
    await page.getByRole('button', { name: 'Order on WhatsApp' }).click()
    await expect(page).toHaveURL(/\/order\/confirmed$/)
    await expectAccessible(page)
})

test('no accessibility problems with the cart panel open', async ({ page }) => {
    test.skip(isMobile(page), 'The cart panel is desktop only')
    await page.goto('/')
    await addToCart(page, product.name)
    await page.getByRole('button', { name: 'Cart (1)' }).click()
    await expect(page.getByRole('dialog', { name: 'Your Cart' })).toBeVisible()
    await expectAccessible(page)
})

test('the skip link jumps past the header to the page content', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    const skip = page.getByRole('link', { name: 'Skip to content' })
    await expect(skip).toBeFocused()
    await skip.press('Enter')
    await expect(page.locator('main')).toBeFocused()
})
