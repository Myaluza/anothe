// Text for the About page. TODO: placeholder copy; replace with the shop's own words.

export const ABOUT_INTRO: string[] = [
    "Anothe is a small, independent beauty shop offering skincare, makeup and fragrance we love and use ourselves.",
    "Browse the shop, add what you like to your cart, and send your order to us on WhatsApp. We'll confirm availability, payment details and delivery with you directly.",
]

export const RETURNS_POLICY: string[] = [
    "If something arrives damaged or isn't what you ordered, message us on WhatsApp within 7 days and we'll make it right.",
    "For hygiene reasons we can't accept returns on opened skincare, makeup or fragrance.",
]

export interface FaqItem {
    question: string
    answer: string
}

export const FAQS: FaqItem[] = [
    {
        question: "How do I pay?",
        answer: "After you send your order on WhatsApp, we'll reply with payment options and confirm your total.",
    },
    {
        question: "How long does delivery take?",
        answer: "Most orders are delivered within 2–4 working days of payment. We'll let you know when yours is on its way.",
    },
    {
        question: "Is my order placed when I tap “Order on WhatsApp”?",
        answer: "Your order is placed once you press Send in WhatsApp. Keep your order reference so we can find it quickly.",
    },
    {
        question: "Can I change my order?",
        answer: "Yes. Message us on WhatsApp with your order reference before it's been sent out.",
    },
]
