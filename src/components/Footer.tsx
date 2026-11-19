import { SHOP_NAME, WHATSAPP_NUMBER } from "../config";

export default function Footer() {
    return (
        <footer className="mt-16 border-t border-gold/40 pt-6 text-center text-sm text-cocoa space-y-2">
            <p>
                Questions? <a className="underline hover:text-gold" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">Chat with us on WhatsApp</a>
            </p>
            <p>© {new Date().getFullYear()} {SHOP_NAME}</p>
        </footer>
    )
}
