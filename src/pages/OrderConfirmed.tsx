import { useState } from "react";
import { Link, Navigate } from "react-router";
import { loadLastOrder } from "../utils/lastOrder";
import { formatCurrency } from "../utils/formatCurrency";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

type CopyState = 'idle' | 'copied' | 'failed'

export default function OrderConfirmed() {
    const [order] = useState(loadLastOrder)
    const [copyState, setCopyState] = useState<CopyState>('idle')
    useDocumentTitle('Order sent')

    if (!order) {
        return <Navigate to="/" replace />
    }

    async function copyOrder() {
        try {
            await navigator.clipboard.writeText(order!.message)
            setCopyState('copied')
        } catch {
            setCopyState('failed')
        }
    }

    const primary = "block w-full text-center bg-gold text-white py-3 rounded-lg text-lg font-semibold hover:bg-espresso"
    const secondary = "block w-full text-center border border-cocoa text-cocoa py-3 rounded-lg hover:bg-white"

    return (
        <section className="max-w-xl mx-auto text-center space-y-6 py-8">
            <h1 className="text-4xl font-display text-gold">Thank you{order.name ? `, ${order.name}` : ''}!</h1>

            <div className="bg-white rounded-xl shadow-md px-6 py-5 space-y-1">
                <p className="text-sm text-cocoa uppercase tracking-wide">Order reference</p>
                <p className="text-2xl font-semibold text-espresso tracking-wider">{order.ref}</p>
                <p className="text-cocoa">Total {formatCurrency(order.totalCents)}</p>
            </div>

            <p className="text-cocoa">
                We've opened WhatsApp with your order. <strong>Press Send in WhatsApp</strong> to place it.
                We'll reply to confirm.
            </p>

            <div className="space-y-3">
                <a className={primary} href={order.whatsappUrl} target="_blank" rel="noopener noreferrer">
                    Open WhatsApp again
                </a>
                <button className={secondary} onClick={copyOrder}>
                    {copyState === 'copied' ? 'Copied ✓' : 'Copy order message'}
                </button>
                {copyState === 'failed' && (
                    <p className="text-sm text-red-600">Couldn't copy automatically. Select the message below and copy it.</p>
                )}
            </div>

            <details className="text-left bg-white rounded-lg px-4 py-3" open={copyState === 'failed'}>
                <summary className="cursor-pointer text-cocoa">View order message</summary>
                <pre className="mt-3 whitespace-pre-wrap font-body text-sm text-cocoa select-all">{order.message}</pre>
            </details>

            <Link to="/" className="inline-block text-cocoa hover:underline">Continue shopping</Link>
        </section>
    )
}
