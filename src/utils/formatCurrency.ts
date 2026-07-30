export function formatCurrency(cents: number): string {
    return (cents / 100).toLocaleString('en-ZA', {
        style: 'currency',
        currency: 'ZAR'
    })
}