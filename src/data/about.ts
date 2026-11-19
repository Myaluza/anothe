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

// Privacy notice (POPIA / GDPR). TODO: fill in the Information Officer's details and
// have the shop owner confirm this matches how they actually handle orders.
export const INFORMATION_OFFICER = {
    name: "Information Officer name to be confirmed",
    contact: "Contact details to be confirmed",
}

export const PRIVACY_NOTICE: string[] = [
    "When you order, we ask for your name, phone number and, for delivery, your address. We use them only to confirm, deliver and support your order.",
    "Your details are not sent to us by this website. They go into a WhatsApp message on your own device, and reach us only if you press Send. We keep order messages for as long as needed to handle the order, returns and our legal record-keeping, and don't sell or share them for marketing.",
    "Your cart is saved in your own browser so it's still there when you come back. Your last order is kept in your browser only until you close the tab. Clearing your cart or your browser data removes them.",
    "We count page visits with Vercel Web Analytics and measure page speed with Vercel Speed Insights. Neither uses cookies or tracks you across other sites, and no advertising trackers are used, so there is no cookie banner.",
    "You can ask us on WhatsApp to see, correct or delete the details we hold about you. If you're unhappy with how we handle your information, you can complain to the Information Regulator (South Africa).",
]
