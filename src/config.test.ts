import { describe, expect, it } from 'vitest'
import { resolveWhatsAppNumber } from './config'

describe('resolveWhatsAppNumber', () => {
    it('uses a valid number from the environment', () => {
        expect(resolveWhatsAppNumber('27831112222', '27000000000')).toBe('27831112222')
    })

    it('ignores spaces and a leading +', () => {
        expect(resolveWhatsAppNumber('+27 83 111 2222', '27000000000')).toBe('27831112222')
    })

    it('falls back when the setting is missing or not a number', () => {
        expect(resolveWhatsAppNumber(undefined, '27000000000')).toBe('27000000000')
        expect(resolveWhatsAppNumber('', '27000000000')).toBe('27000000000')
        expect(resolveWhatsAppNumber('083-111-2222', '27000000000')).toBe('27000000000')
        expect(resolveWhatsAppNumber('123', '27000000000')).toBe('27000000000')
    })
})
