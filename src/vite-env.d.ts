/// <reference types="vite/client" />

interface ImportMetaEnv {
    // Optional: the shop's WhatsApp number for this environment (see src/config.ts).
    readonly VITE_WHATSAPP_NUMBER?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
