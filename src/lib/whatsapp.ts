import twilio from "twilio"

const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886" // Twilio sandbox

let client: ReturnType<typeof twilio> | null = null
function getClient() {
  if (client) return client
  const accountSid = process.env.TWILIO_ACCOUNT_SID || ""
  const authToken = process.env.TWILIO_AUTH_TOKEN || ""
  if (accountSid && authToken && accountSid.startsWith("AC")) {
    client = twilio(accountSid, authToken)
  }
  return client
}

// ─── Base Sender ─────────────────────────────────────────────────────────────

interface SendWhatsAppOptions {
  to: string // Phone number with country code, e.g., "6281234567890"
  message: string
  mediaUrl?: string[]
}

export async function sendWhatsAppMessage(options: SendWhatsAppOptions) {
  const twilioClient = getClient()
  if (!twilioClient) {
    console.warn("Twilio not configured. Skipping WhatsApp send.")
    return { success: false, id: null, error: "Twilio not configured" }
  }

  try {
    // Format phone number for WhatsApp
    const toNumber = options.to.startsWith("+")
      ? `whatsapp:${options.to}`
      : `whatsapp:+${options.to.replace(/[^0-9]/g, "")}`

    const result = await twilioClient.messages.create({
      from: whatsappFrom,
      to: toNumber,
      body: options.message,
      mediaUrl: options.mediaUrl,
    })

    return { success: true, id: result.sid, error: null }
  } catch (error) {
    console.error("WhatsApp send error:", error)
    return {
      success: false,
      id: null,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// ─── Template: Car Inquiry Notification ──────────────────────────────────────

interface InquiryTemplateData {
  sellerName: string
  buyerName: string
  carTitle: string
  carPrice: string
  buyerPhone: string
  message?: string
}

export function formatInquiryMessage(data: InquiryTemplateData): string {
  return `
🚗 *New Car Inquiry*

Hi ${data.sellerName}!

${data.buyerName} is interested in your listing:

*${data.carTitle}*
💰 ${data.carPrice}

${data.message ? `📝 Message: "${data.message}"` : ""}

📞 Buyer Phone: ${data.buyerPhone}

Reply to this message or call them directly to follow up.

— AutoCar Marketplace
  `.trim()
}

export async function sendInquiryNotification(
  sellerPhone: string,
  data: InquiryTemplateData
) {
  const message = formatInquiryMessage(data)
  return sendWhatsAppMessage({ to: sellerPhone, message })
}

// ─── Template: Car Promotion ─────────────────────────────────────────────────

interface PromotionTemplateData {
  recipientName: string
  headline: string
  body: string
  carTitle?: string
  carPrice?: string
  ctaUrl?: string
}

export function formatPromotionMessage(data: PromotionTemplateData): string {
  let msg = `
📢 *${data.headline}*

Hi ${data.recipientName}!
  `.trim()

  if (data.carTitle) {
    msg += `\n\n🚗 *${data.carTitle}*`
  }
  if (data.carPrice) {
    msg += `\n💰 ${data.carPrice}`
  }

  msg += `\n\n${data.body}`

  if (data.ctaUrl) {
    msg += `\n\n👉 ${data.ctaUrl}`
  }

  msg += `\n\n_Browse more at AutoCar.id_`

  return msg
}

export async function sendPromotionMessage(
  recipientPhone: string,
  data: PromotionTemplateData
) {
  const message = formatPromotionMessage(data)
  return sendWhatsAppMessage({ to: recipientPhone, message })
}

// ─── Template: Price Drop Alert ──────────────────────────────────────────────

interface PriceDropTemplateData {
  recipientName: string
  carTitle: string
  oldPrice: string
  newPrice: string
  carUrl: string
}

export function formatPriceDropMessage(data: PriceDropTemplateData): string {
  return `
🔥 *Price Drop Alert!*

Hi ${data.recipientName}!

A car on your watchlist just dropped in price:

*${data.carTitle}*
~~${data.oldPrice}~~ → *${data.newPrice}*

Don't miss out — view details now:
${data.carUrl}

— AutoCar Marketplace
  `.trim()
}

export async function sendPriceDropAlert(
  recipientPhone: string,
  data: PriceDropTemplateData
) {
  const message = formatPriceDropMessage(data)
  return sendWhatsAppMessage({ to: recipientPhone, message })
}

// ─── Template: Listing Confirmed ─────────────────────────────────────────────

interface ListingConfirmedTemplateData {
  sellerName: string
  carTitle: string
  carPrice: string
  listingUrl: string
}

export function formatListingConfirmedMessage(
  data: ListingConfirmedTemplateData
): string {
  return `
✅ *Your Car is Live!*

Hi ${data.sellerName}!

Your listing has been published:

*${data.carTitle}*
💰 ${data.carPrice}

View your listing:
${data.listingUrl}

Tips to sell faster:
📹 Add a video tour
📝 Write a detailed description
💲 Set a competitive price

Good luck with the sale!

— AutoCar Marketplace
  `.trim()
}

export async function sendListingConfirmed(
  sellerPhone: string,
  data: ListingConfirmedTemplateData
) {
  const message = formatListingConfirmedMessage(data)
  return sendWhatsAppMessage({ to: sellerPhone, message })
}

// ─── Template: Inquiry Response ──────────────────────────────────────────────

interface InquiryResponseTemplateData {
  buyerName: string
  carTitle: string
  sellerName: string
  message: string
}

export function formatInquiryResponseMessage(
  data: InquiryResponseTemplateData
): string {
  return `
💬 *Reply from ${data.sellerName}*

Regarding: *${data.carTitle}*

"${data.message}"

Reply to continue the conversation.

— AutoCar Marketplace
  `.trim()
}

export async function sendInquiryResponse(
  buyerPhone: string,
  data: InquiryResponseTemplateData
) {
  const message = formatInquiryResponseMessage(data)
  return sendWhatsAppMessage({ to: buyerPhone, message })
}

// ─── Template: New Car Match ─────────────────────────────────────────────────

interface NewCarMatchTemplateData {
  recipientName: string
  carTitle: string
  carPrice: string
  carUrl: string
}

export function formatNewCarMatchMessage(
  data: NewCarMatchTemplateData
): string {
  return `
🆕 *New Car Matching Your Search!*

Hi ${data.recipientName}!

We found a new listing that matches your criteria:

*${data.carTitle}*
💰 ${data.carPrice}

View details:
${data.carUrl}

— AutoCar Marketplace
  `.trim()
}

export async function sendNewCarMatch(
  recipientPhone: string,
  data: NewCarMatchTemplateData
) {
  const message = formatNewCarMatchMessage(data)
  return sendWhatsAppMessage({ to: recipientPhone, message })
}
