import { describe, it, expect} from 'vitest'
import { formatCurrency } from './formatCurrency'

describe('FormatCurrency', () => {
    it('converts cents to rands', () => {
        expect(formatCurrency(15000)).toContain('150,00')
    })
    it('handles zero', () => {
        expect(formatCurrency(0)).toContain('0,00')
    })
    it('handles cents without rounding', () => {
        expect(formatCurrency(13999)).toContain('139,99')
    })
})