import { expect, test } from './fixtures'

test('offline: opening a new page shows the error page, which recovers once back online', async ({ page, context }) => {
    await page.goto('/')
    await expect(page.locator('article').first()).toBeVisible()

    // The About page hasn't been downloaded yet, so going offline makes it fail.
    await context.setOffline(true)
    await page.getByRole('banner').getByRole('link', { name: 'About' }).click()
    await expect(page.getByRole('alert')).toContainText('Something went wrong')
    // The rest of the site still works, and the WhatsApp fallback is offered.
    await expect(page.getByRole('link', { name: 'Order on WhatsApp' })).toBeVisible()
    await expect(page.getByRole('banner').getByRole('link', { name: 'Shop' })).toBeVisible()

    await context.setOffline(false)
    await page.getByRole('button', { name: 'Reload the page' }).click()
    await expect(page.getByRole('heading', { level: 1, name: /About/ })).toBeVisible()
})
