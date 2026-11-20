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

test('removing items keeps keyboard focus in the cart', async ({ page }) => {
    const [first, second] = products.filter(p => p.variants[0].inStock)
    const lineOf = (p: typeof first) => `${p.name} (${p.variants[0].label})`
    await page.goto('/')
    await addToCart(page, first.name)
    await addToCart(page, second.name)

    // Desktop uses the cart panel; phones use the checkout page. Both show the same cart.
    let cart
    if (isMobile(page)) {
        await page.goto('/checkout')
        cart = page.locator('main')
    } else {
        await page.getByRole('button', { name: 'Cart (2)' }).click()
        cart = page.getByRole('dialog', { name: 'Your Cart' })
    }

    // Removing a line moves focus to the line that takes its place...
    await cart.getByRole('button', { name: `Remove ${lineOf(first)}` }).click()
    await expect(cart.getByRole('button', { name: `Remove ${lineOf(second)}` })).toBeFocused()

    // ...and removing the last one (here with −) moves it to the "empty" message.
    await cart.getByRole('button', { name: `Decrease quantity of ${lineOf(second)}` }).click()
    await expect(cart.getByText('Your cart is empty')).toBeFocused()
})

test('phone: the Cart button goes to the checkout page', async ({ page }) => {
    test.skip(!isMobile(page), 'Desktop opens the cart panel instead')
    await page.goto('/')
    await addToCart(page, product.name)
    await page.getByRole('link', { name: 'Cart (1)' }).click()
    await expect(page).toHaveURL(/\/checkout$/)
    await expect(page.locator('main').getByText(product.name, { exact: true })).toBeVisible()
})

test('smallest phones: the header stays on one line with a three-digit cart count', async ({ page }) => {
    test.skip(!isMobile(page), 'Only the narrowest screens are at risk')
    await page.setViewportSize({ width: 320, height: 640 })
    await page.goto('/')
    await addToCart(page, product.name)
    // Raise the saved quantity to 100 so the Cart label is as wide as it gets.
    await page.evaluate(() => {
        const cart = JSON.parse(localStorage.getItem('anothe-cart')!)
        cart[0].quantity = 100
        localStorage.setItem('anothe-cart', JSON.stringify(cart))
    })
    await page.reload()

    const header = page.getByRole('banner').filter({ has: page.getByRole('navigation', { name: 'Main' }) })
    const cart = header.getByRole('link', { name: 'Cart (100)' })
    await expect(cart).toBeVisible()
    const about = await header.getByRole('link', { name: 'About' }).boundingBox()
    const cartBox = (await cart.boundingBox())!
    // Same row as the links, with room between them.
    expect(Math.abs(cartBox.y + cartBox.height / 2 - (about!.y + about!.height / 2))).toBeLessThan(4)
    expect(cartBox.x - (about!.x + about!.width)).toBeGreaterThanOrEqual(8)
    expect((await header.boundingBox())!.height).toBeLessThan(80)
})

test('the cart is kept after a reload', async ({ page }) => {
    await page.goto('/')
    await addToCart(page, product.name)
    await page.reload()
    await expect(page.getByRole('banner').getByText('Cart (1)').first()).toBeAttached()
})
