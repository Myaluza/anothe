import { Link } from "react-router";
import { ABOUT_INTRO, FAQS, INFORMATION_OFFICER, PRIVACY_NOTICE, RETURNS_POLICY } from "../data/about";
import { COLLECTION, DELIVERY_AREAS, SHOP_NAME, WHATSAPP_NUMBER } from "../config";
import { formatCurrency } from "../utils/formatCurrency";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
    return (
        <section aria-labelledby={id} className="bg-white rounded-xl shadow-md px-6 py-5 space-y-3">
            <h2 id={id} className="text-2xl font-display text-gold">{title}</h2>
            {children}
        </section>
    )
}

export default function About() {
    useDocumentTitle('About & FAQ')

    return (
        <div className="max-w-3xl mx-auto space-y-6 text-cocoa">
            <h1 className="text-center text-5xl font-display text-gold">About {SHOP_NAME}</h1>

            <Section id="about-us" title="Who we are">
                {ABOUT_INTRO.map(p => <p key={p} className="leading-relaxed">{p}</p>)}
            </Section>

            <Section id="delivery" title="Delivery & collection">
                <p>We deliver to these areas:</p>
                <ul className="divide-y divide-gold-light/30">
                    {DELIVERY_AREAS.map(area => (
                        <li key={area.id} className="flex justify-between py-1.5">
                            <span>{area.name}</span>
                            <span className="font-semibold text-espresso">{formatCurrency(area.feeCents)}</span>
                        </li>
                    ))}
                </ul>
                {COLLECTION.enabled && (
                    <p>
                        Or collect for free from <strong>{COLLECTION.address}</strong>. {COLLECTION.note}
                    </p>
                )}
            </Section>

            <Section id="returns" title="Returns">
                {RETURNS_POLICY.map(p => <p key={p} className="leading-relaxed">{p}</p>)}
            </Section>

            <Section id="faq" title="Frequently asked questions">
                <div className="divide-y divide-gold-light/30">
                    {FAQS.map(faq => (
                        <details key={faq.question} className="py-3 group">
                            <summary className="cursor-pointer font-semibold text-espresso list-none flex justify-between gap-4">
                                {faq.question}
                                <span className="text-gold group-open:rotate-45 transition-transform" aria-hidden="true">+</span>
                            </summary>
                            <p className="mt-2 leading-relaxed">{faq.answer}</p>
                        </details>
                    ))}
                </div>
            </Section>

            <Section id="privacy" title="Privacy">
                {PRIVACY_NOTICE.map(p => <p key={p} className="leading-relaxed">{p}</p>)}
                <p className="leading-relaxed">
                    Information Officer: {INFORMATION_OFFICER.name}, {INFORMATION_OFFICER.contact}.
                </p>
            </Section>

            <Section id="contact" title="Contact us">
                <p>The quickest way to reach us is on WhatsApp.</p>
                <a
                    className="inline-block bg-gold text-white px-6 py-3 rounded-lg font-semibold hover:bg-espresso"
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Chat with us on WhatsApp
                </a>
            </Section>

            <p className="text-center">
                <Link to="/" className="inline-block py-2 text-cocoa hover:underline">← Back to shop</Link>
            </p>
        </div>
    )
}
