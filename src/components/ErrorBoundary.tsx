import { Component, type ErrorInfo, type ReactNode } from 'react'
import { WHATSAPP_NUMBER } from '../config'

interface ErrorBoundaryProps {
    children: ReactNode
    // When this value changes (e.g. the visitor navigates to another page), the error is cleared.
    resetKey?: string
    // True for the outermost boundary, which has no page layout around it.
    fullPage?: boolean
}

interface ErrorBoundaryState {
    error: Error | null
}

// Shows a friendly page instead of a blank screen if something breaks while rendering.
// Plain <a> links (not router links) are used so they still work if the app itself is broken.
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { error: null }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { error }
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('Page failed to render', error, info.componentStack)
    }

    componentDidUpdate(prevProps: ErrorBoundaryProps) {
        if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
            this.setState({ error: null })
        }
    }

    render() {
        if (!this.state.error) return this.props.children

        const content = (
            <section role="alert" className="max-w-2xl mx-auto text-center space-y-4 py-16">
                <h1 className="text-4xl font-display text-gold">Something went wrong</h1>
                <p className="text-cocoa">
                    This page didn't load properly. Your cart is saved, so nothing is lost.
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="bg-gold text-cream rounded py-2 px-6 hover:bg-espresso"
                    >
                        Reload the page
                    </button>
                    <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded border border-gold-light py-2 px-6 text-cocoa hover:bg-gold-light/20"
                    >
                        Order on WhatsApp
                    </a>
                </div>
                <a href="/" className="inline-block py-2 text-cocoa hover:underline">Back to the shop</a>
            </section>
        )

        return this.props.fullPage
            ? <div className="bg-cream min-h-screen px-4 py-8">{content}</div>
            : content
    }
}
