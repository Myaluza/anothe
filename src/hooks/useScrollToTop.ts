import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router";

// How long to keep looking for a #target while a lazily loaded page downloads.
const HASH_WAIT_MS = 3000

// Scrolls to the element a #hash points to, checking each frame until it exists
// (its page may still be downloading). Returns a cancel function.
function scrollToHash(hash: string): () => void {
    let frame = 0
    const deadline = performance.now() + HASH_WAIT_MS
    const tryScroll = () => {
        const target = document.getElementById(decodeURIComponent(hash.slice(1)))
        if (target) {
            target.scrollIntoView()
        } else if (performance.now() < deadline) {
            frame = requestAnimationFrame(tryScroll)
        }
    }
    tryScroll()
    return () => cancelAnimationFrame(frame)
}

// Start each new page at the top, like a normal website would, or at the #section
// a link points to (e.g. /about#privacy), including when such a link is opened directly.
// Back/forward (POP) is left alone so the browser can restore where the visitor was.
// Changing filters or search (?category=, ?q=) keeps the scroll position.
export function useScrollToTop() {
    const { pathname, hash } = useLocation()
    const navigationType = useNavigationType()
    const last = useRef<{ pathname: string; hash: string } | null>(null)

    useEffect(() => {
        const isFirstLoad = last.current === null
        const changed = !isFirstLoad && (pathname !== last.current!.pathname || hash !== last.current!.hash)
        last.current = { pathname, hash }

        if (isFirstLoad) {
            return hash ? scrollToHash(hash) : undefined
        }
        if (!changed || navigationType === 'POP') return

        if (hash) {
            return scrollToHash(hash)
        }
        window.scrollTo(0, 0)
    }, [pathname, hash, navigationType])
}
