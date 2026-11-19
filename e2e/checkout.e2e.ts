import { products } from '../src/data/products'
import { COLLECTION, DELIVERY_FEE_CENTS } from '../src/config'
import { formatCurrency } from '../src/utils/formatCurrency'
import { addToCart, expect, openedLinks, test } from './fixtures'
import type { Page } from '@playwright/test'

const product = products.find(p => p.variants[0].inStock)!
const price = product.variants[0].price

async function goToCheckoutWithOneItem(page: Page) {
    await page.goto('/')
    await addToCart(page, product.name)
    await page.goto('/checkout')
}

// The order goes to the same number as the footer's WhatsApp link. Reading it from the page
// keeps this right whichever number the build uses (VITE_WHATSAPP_NUMBER or the default).
async function sentMessage(page: Page) {
    const links = await openedLinks(page)
    expect(links).toHaveLength(1)
    const url = new URL(links[0])
    const footerLink = await page.getByRole('contentinfo').getByRole('link', { name: 'Chat with us on WhatsApp' }).getAttribute('href')
    expect(footerLink).toMatch(/^https:\/\/wa\.me\/\d{8,15}$/)
    expect(`${url.origin}${url.pathname}`).toBe(footerLink)
    return url.searchParams.get('text') ?? ''
}

test('delivery order: sends the right WhatsApp message and shows the confirmation', async ({ page }) => {
    await goToCheckoutWithOneItem(page)
    const total = formatCurrency(price + DELIVERY_FEE_CENTS)

    await page.getByLabel('Name').fill('Test Buyer')
    await page.getByLabel('Phone').fill('082 123 4567')
    await page.getByLabel('Delivery address').fill('12 Example Road, Umhlanga')
    await expect(page.getByRole('definition').filter({ hasText: total })).toBeVisible()
    await page.getByRole('button', { name: 'Order on WhatsApp' }).click()

    await expect(page).toHaveURL(/\/order\/confirmed$/)
    const message = await sentMessage(page)
    expect(message).toContain(`1 x ${product.name} (${product.variants[0].label})`)
    expect(message).toContain(`Delivery: ${formatCurrency(DELIVERY_FEE_CENTS)}`)
    expect(message).toContain(`Total: ${total}`)
    expect(message).toContain('Deliver to: 12 Example Road, Umhlanga')

    // The confirmation shows the same reference and total as the message.
    const ref = message.match(/Order ref: (\S+)/)![1]
    await expect(page.getByRole('heading', { name: 'Thank you, Test Buyer!' })).toBeVisible()
    await expect(page.getByText(ref, { exact: true })).toBeVisible()
    await expect(page.getByText(`Total ${total}`)).toBeVisible()

    // The cart is emptied once the order is sent.
    await expect(page.getByRole('banner').getByText(/Cart \(/)).toHaveCount(0)
})

test('collection order: free, with the collection point in the message', async ({ page }) => {
    test.skip(!COLLECTION.enabled, 'Collection is switched off')
    await goToCheckoutWithOneItem(page)

    await page.getByLabel('Name').fill('Test Buyer')
    await page.getByLabel('Phone').fill('0821234567')
    await page.getByText('Collection (free)').click()
    await expect(page.getByLabel('Delivery address')).toHaveCount(0)
    await page.getByRole('button', { name: 'Order on WhatsApp' }).click()

    await expect(page).toHaveURL(/\/order\/confirmed$/)
    const message = await sentMessage(page)
    expect(message).toContain('Collection: free')
    expect(message).toContain(`Total: ${formatCurrency(price)}`)
    expect(message).toContain(`Collect from: ${COLLECTION.address}`)
})

test('missing details: errors are shown, linked to the fields, and focus goes to the first', async ({ page }) => {
    await goToCheckoutWithOneItem(page)
    await page.getByRole('button', { name: 'Order on WhatsApp' }).click()

    const name = page.getByLabel('Name')
    await expect(name).toBeFocused()
    await expect(name).toHaveAttribute('aria-invalid', 'true')
    await expect(name).toHaveAccessibleDescription('Please enter your name')
    await expect(page.getByLabel('Phone')).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByLabel('Delivery address')).toHaveAttribute('aria-invalid', 'true')
    expect(await openedLinks(page)).toEqual([])

    // An invalid phone number is caught too.
    await name.fill('Test Buyer')
    await page.getByLabel('Phone').fill('12345')
    await page.getByRole('button', { name: 'Order on WhatsApp' }).click()
    await expect(page.getByLabel('Phone')).toBeFocused()
    await expect(page.getByLabel('Phone')).toHaveAccessibleDescription(/valid phone number/)
})

test('the confirmation page without an order goes back to the shop', async ({ page }) => {
    await page.goto('/order/confirmed')
    await expect(page).toHaveURL(/\/$/)
    await expect(page.locator('article').first()).toBeVisible()
})
