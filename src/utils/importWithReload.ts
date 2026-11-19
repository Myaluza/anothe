// After a new deploy, the file names of page bundles change and the old ones are gone.
// A visitor who still has the previous version open gets a failed download the next time
// they open a page that wasn't loaded yet. Reloading once fetches the new version and fixes it.
// A flag in sessionStorage makes sure this happens at most once, so it can never loop.

export const RELOAD_FLAG = 'anothe:chunk-reload'

interface ReloadDeps {
    storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> | null
    reload: () => void
    // Reloading while offline would replace our error page with the browser's "No internet" page.
    isOnline?: () => boolean
}

function browserDeps(): ReloadDeps {
    let storage: Storage | null = null
    try {
        storage = window.sessionStorage
    } catch {
        // Storage blocked (e.g. strict privacy settings): fall back to showing the error page.
    }
    return { storage, reload: () => window.location.reload(), isOnline: () => navigator.onLine }
}

// Returns true if a reload was started, false if one already happened, the visitor is
// offline, or it can't be tracked. In those cases the error page (with a Reload button) shows.
export function reloadOnce(deps: ReloadDeps = browserDeps()): boolean {
    const { storage, reload, isOnline = () => true } = deps
    if (!storage || !isOnline()) return false
    try {
        if (storage.getItem(RELOAD_FLAG)) {
            // Already reloaded once and it still fails: clear the flag so a later deploy
            // can recover the same way, and let the error page show.
            storage.removeItem(RELOAD_FLAG)
            return false
        }
        storage.setItem(RELOAD_FLAG, '1')
    } catch {
        return false
    }
    reload()
    return true
}

export async function importWithReload<T>(importer: () => Promise<T>, deps: ReloadDeps = browserDeps()): Promise<T> {
    try {
        const module = await importer()
        try {
            deps.storage?.removeItem(RELOAD_FLAG)
        } catch {
            // ignore
        }
        return module
    } catch (error) {
        if (reloadOnce(deps)) {
            // The page is reloading; never settle so nothing flashes an error meanwhile.
            return new Promise<T>(() => {})
        }
        throw error
    }
}
