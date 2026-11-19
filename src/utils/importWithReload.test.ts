import { describe, expect, it, vi } from 'vitest'
import { importWithReload, reloadOnce, RELOAD_FLAG } from './importWithReload'

function memoryStorage(initial: Record<string, string> = {}) {
    const data = new Map(Object.entries(initial))
    return {
        getItem: (key: string) => data.get(key) ?? null,
        setItem: (key: string, value: string) => void data.set(key, value),
        removeItem: (key: string) => void data.delete(key),
        has: (key: string) => data.has(key),
    }
}

describe('reloadOnce', () => {
    it('reloads the first time and sets the flag', () => {
        const storage = memoryStorage()
        const reload = vi.fn()
        expect(reloadOnce({ storage, reload })).toBe(true)
        expect(reload).toHaveBeenCalledOnce()
        expect(storage.has(RELOAD_FLAG)).toBe(true)
    })

    it('does not reload a second time, and clears the flag for next time', () => {
        const storage = memoryStorage({ [RELOAD_FLAG]: '1' })
        const reload = vi.fn()
        expect(reloadOnce({ storage, reload })).toBe(false)
        expect(reload).not.toHaveBeenCalled()
        expect(storage.has(RELOAD_FLAG)).toBe(false)
    })

    it('does not reload when storage is unavailable', () => {
        const reload = vi.fn()
        expect(reloadOnce({ storage: null, reload })).toBe(false)
        expect(reload).not.toHaveBeenCalled()
    })

    it('does not reload when storage throws', () => {
        const reload = vi.fn()
        const storage = {
            getItem: () => { throw new Error('blocked') },
            setItem: () => {},
            removeItem: () => {},
        }
        expect(reloadOnce({ storage, reload })).toBe(false)
        expect(reload).not.toHaveBeenCalled()
    })
})

describe('importWithReload', () => {
    it('returns the module and clears a leftover flag', async () => {
        const storage = memoryStorage({ [RELOAD_FLAG]: '1' })
        const result = await importWithReload(async () => 'page', { storage, reload: vi.fn() })
        expect(result).toBe('page')
        expect(storage.has(RELOAD_FLAG)).toBe(false)
    })

    it('reloads instead of failing the first time a download fails', async () => {
        const storage = memoryStorage()
        const reload = vi.fn()
        const pending = importWithReload(() => Promise.reject(new Error('Failed to fetch')), { storage, reload })
        const settled = await Promise.race([pending.then(() => 'settled', () => 'settled'), new Promise(r => setTimeout(() => r('pending'), 20))])
        expect(settled).toBe('pending')
        expect(reload).toHaveBeenCalledOnce()
    })

    it('fails if the download still fails after the reload', async () => {
        const storage = memoryStorage({ [RELOAD_FLAG]: '1' })
        const reload = vi.fn()
        await expect(importWithReload(() => Promise.reject(new Error('Failed to fetch')), { storage, reload })).rejects.toThrow('Failed to fetch')
        expect(reload).not.toHaveBeenCalled()
    })
})
