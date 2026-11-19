import { test as base, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// Shared setup for every test:
// - window.open is replaced so "Order on WhatsApp" records the wa.me link instead of leaving the site.
// - Any Content-Security-Policy violation or uncaught script error fails the test.
export const test = base.extend<{ problems: string[] }>({
    problems: [async ({ page }, use) => {
        const problems: string[] = []
        await page.exposeBinding('__reportCsp', (_source, message: string) => { problems.push(`CSP: ${message}`) })
        await page.addInitScript(() => {
            const w = window as unknown as { __opened: string[]; __reportCsp: (m: string) => void }
            w.__opened = []
            window.open = (url?: string | URL) => { w.__opened.push(String(url)); return null }
            document.addEventListener('securitypolicyviolation', e => w.__reportCsp(`${e.violatedDirective} blocked ${e.blockedURI}`))
        })
        page.on('pageerror', error => problems.push(`Script error: ${error.message}`))

        await use(problems)

        expect(problems, 'CSP violations or script errors').toEqual([])
    }, { auto: true }],
})

export { expect }

export function isMobile(page: Page) {
    return (page.viewportSize()?.width ?? 0) < 1024
}

// The wa.me links "opened" so far on this page.
export function openedLinks(page: Page): Promise<string[]> {
    return page.evaluate(() => (window as unknown as { __opened: string[] }).__opened)
}

export function productCard(page: Page, name: string) {
    return page.locator('article').filter({ has: page.getByRole('heading', { name, exact: true }) })
}

export async function addToCart(page: Page, name: string) {
    await productCard(page, name).getByRole('button', { name: 'Add to cart' }).click()
    await expect(productCard(page, name).getByRole('button', { name: 'Added ✓' })).toBeVisible()
}

// Scans the page for WCAG 2.2 A/AA problems and fails with a readable list.
export async function expectAccessible(page: Page) {
    const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze()
    const summary = results.violations.map(v => `${v.id}: ${v.help} (${v.nodes.map(n => n.target.join(' ')).join(', ')})`)
    expect(summary).toEqual([])
}
