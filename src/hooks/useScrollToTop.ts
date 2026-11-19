import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router";

// Start each new page at the top, like a normal website would.
// Back/forward (POP) is left alone so the browser can restore where the visitor was.
// Only the path counts: changing filters or search (?category=, ?q=) keeps the scroll position.
export function useScrollToTop() {
    const { pathname } = useLocation()
    const navigationType = useNavigationType()
    const lastPathname = useRef(pathname)

    useEffect(() => {
        if (pathname === lastPathname.current) return
        lastPathname.current = pathname
        if (navigationType !== 'POP') {
            window.scrollTo(0, 0)
        }
    }, [pathname, navigationType])
}
