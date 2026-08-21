const WA_API_URL = "https://graph.facebook.com/v18.0"
const WA_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || ""
const WA_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || ""
const WA_BUSINESS_ACCOUNT = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || ""

interface WhatsAppMessage {
  to: string
  template?: string
  text?: string
  type?: "text" | "template" | "image"
}

interface WhatsAppResponse {
  messaging_product: string
  contacts: Array<{ input: string; wa_id: string }>
  messages: Array<{ id: string }>
}

// Send a simple text message
export async function sendWhatsAppMessage(
  to: string,
  message: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!WA_PHONE_NUMBER_ID || !WA_ACCESS_TOKEN) {
    console.warn("WhatsApp API not configured - message not sent")
    return { success: false, error: "WhatsApp API not configured" }
  }

  try {
    const response = await fetch(
      `${WA_API_URL}/${WA_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WA_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: to.replace(/[^0-9]/g, ""),
          type: "text",
          text: { body: message },
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error("WhatsApp API error:", data)
      return { success: false, error: data.error?.message || "Failed to send" }
    }

    return {
      success: true,
      messageId: data.messages?.[0]?.id,
    }
  } catch (error) {
    console.error("WhatsApp send error:", error)
    return { success: false, error: "Network error" }
  }
}

// Send a template message (for business verification)
export async function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  languageCode: string = "id",
  parameters?: Array<{ type: string; text: string }>
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!WA_PHONE_NUMBER_ID || !WA_ACCESS_TOKEN) {
    console.warn("WhatsApp API not configured")
    return { success: false, error: "WhatsApp API not configured" }
  }

  try {
    const template: Record<string, unknown> = {
      name: templateName,
      language: { code: languageCode },
    }

    if (parameters && parameters.length > 0) {
      template.components = [
        {
          type: "body",
          parameters: parameters.map((p) => ({
            type: "text",
            text: p.text,
          })),
        },
      ]
    }

    const response = await fetch(
      `${WA_API_URL}/${WA_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WA_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: to.replace(/[^0-9]/g, ""),
          type: "template",
          template,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.error?.message || "Failed to send template" }
    }

    return {
      success: true,
      messageId: data.messages?.[0]?.id,
    }
  } catch (error) {
    console.error("WhatsApp template error:", error)
    return { success: false, error: "Network error" }
  }
}

// Generate click-to-chat URL (no API needed)
export function generateClickToChatUrl(
  phoneNumber: string,
  message: string
): string {
  const phone = phoneNumber.replace(/[^0-9]/g, "")
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

// Check if WhatsApp API is configured
export function isWhatsAppConfigured(): boolean {
  return !!(WA_PHONE_NUMBER_ID && WA_ACCESS_TOKEN)
}
