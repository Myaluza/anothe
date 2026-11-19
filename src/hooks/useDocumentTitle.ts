import { useEffect } from "react";
import { SHOP_NAME } from "../config";

// Sets the browser tab title, e.g. "Checkout · Anothe". Pass null for just the shop name.
export function useDocumentTitle(page: string | null) {
    useEffect(() => {
        document.title = page ? `${page} · ${SHOP_NAME}` : SHOP_NAME
    }, [page])
}
