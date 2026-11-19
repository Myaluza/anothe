import { products } from '../src/data/products'
import { formatCurrency } from '../src/utils/formatCurrency'
import { addToCart, expect, isMobile, test } from './fixtures'

const product = products.find(p => p.variants[0].inStock)!
const price = product.variants[0].price

test('desktop: the cart panel opens, closes with Escape and returns focus', async ({ page }) => {
    test.skip(isMobile(page), 'Phones go straight to the checkout page instead')
    await page.goto('/')
    await addToCart(page, product.name)

    const cartButton = page.getByRole('button', { name: 'Cart (1)' })
    await cartButton.click()
    const panel = page.getByRole('dialog', { name: 'Your Cart' })
    await expect(panel).toBeVisible()
    await expect(page.getByRole('button', { name: 'Close cart' })).toBeFocused()

    await page.keyboard.press('Escape')
    await expect(cartButton).toBeFocused()
})

test('desktop: change quantities and remove items in the cart panel', async ({ page }) => {
    test.skip(isMobile(page), 'Phones use the checkout page, covered below')
    await page.goto('/')
    await addToCart(page, product.name)
    await page.getByRole('button', { name: 'Cart (1)' }).click()
    const panel = page.getByRole('dialog', { name: 'Your Cart' })
    const line = `${product.name} (${product.variants[0].label})`

    await panel.getByRole('button', { name: `Increase quantity of ${line}` }).click()
    await expect(panel.getByText('Qty: 2')).toBeVisible()
    await expect(panel.getByText(formatCurrency(price * 2)).first()).toBeVisible()

    await panel.getByRole('button', { name: `Decrease quantity of ${line}` }).click()
    await expect(panel.getByText('Qty: 1')).toBeVisible()

    await panel.getByRole('button', { name: `Remove ${line}` }).click()
    await expect(panel.getByText('Your cart is empty')).toBeVisible()
})

test('phone: the Cart button goes to the checkout page', async ({ page }) => {
    test.skip(!isMobile(page), 'Desktop opens the cart panel instead')
    await page.goto('/')
    await addToCart(page, product.name)
    await page.getByRole('link', { name: 'Cart (1)' }).click()
    await expect(page).toHaveURL(/\/checkout$/)
    await expect(page.locator('main').getByText(product.name, { exact: true })).toBeVisible()
})

test('the cart is kept after a reload', async ({ page }) => {
    await page.goto('/')
    await addToCart(page, product.name)
    await page.reload()
    await expect(page.getByRole('banner').getByText('Cart (1)').first()).toBeAttached()
})
