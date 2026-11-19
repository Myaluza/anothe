import { Link } from "react-router";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function NotFound() {
    useDocumentTitle('Page not found')
    return (
        <section className="max-w-2xl mx-auto text-center space-y-4 py-16">
            <h1 className="text-5xl font-display text-gold">Page not found</h1>
            <p className="text-cocoa">We couldn't find the page you were looking for.</p>
            <Link className="inline-block py-2 text-cocoa hover:underline" to='/'>Back to the shop</Link>
        </section>
    )
}
