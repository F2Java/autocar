import { sendWhatsAppMessage, sendPromotionMessage, sendPriceDropAlert } from "./whatsapp"

// ─── Rate Limiting ───────────────────────────────────────────────────────────

// Twilio WhatsApp: 100 messages/second for verified senders
// WhatsApp Business API: 1000 messages/second (Tier 1), scales with quality
// Conservative limits for safety
const RATE_LIMIT = {
  maxPerSecond: 5,
  maxPerDay: 10000,
  retryDelay: 2000,
  maxRetries: 3,
}

// ─── Bulk Send Result ────────────────────────────────────────────────────────

export interface BulkWhatsAppResult {
  total: number
  sent: number
  failed: number
  errors: Array<{ phone: string; error: string }>
}

// ─── Send Bulk Promotions ────────────────────────────────────────────────────

interface BulkPromotionWhatsAppData {
  recipients: Array<{
    phone: string
    name?: string
  }>
  headline: string
  body: string
  carTitle?: string
  carPrice?: string
  ctaUrl?: string
  onProgress?: (sent: number, total: number) => void
}

export async function sendBulkWhatsAppPromotions(
  data: BulkPromotionWhatsAppData
): Promise<BulkWhatsAppResult> {
  const result: BulkWhatsAppResult = {
    total: data.recipients.length,
    sent: 0,
    failed: 0,
    errors: [],
  }

  // Process in batches of 5
  const batchSize = 5
  const batches = []
  for (let i = 0; i < data.recipients.length; i += batchSize) {
    batches.push(data.recipients.slice(i, i + batchSize))
  }

  for (const batch of batches) {
    const promises = batch.map(async (recipient) => {
      try {
        const sendResult = await sendPromotionMessage(recipient.phone, {
          recipientName: recipient.name || "Customer",
          headline: data.headline,
          body: data.body,
          carTitle: data.carTitle,
          carPrice: data.carPrice,
          ctaUrl: data.ctaUrl,
        })

        if (sendResult.success) {
          result.sent++
        } else {
          result.failed++
          result.errors.push({
            phone: recipient.phone,
            error: sendResult.error || "Unknown error",
          })
        }
      } catch (error) {
        result.failed++
        result.errors.push({
          phone: recipient.phone,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }

      data.onProgress?.(result.sent + result.failed, result.total)
    })

    await Promise.all(promises)

    // Wait between batches
    if (batches.indexOf(batch) < batches.length - 1) {
      await new Promise((r) => setTimeout(r, 1000))
    }
  }

  return result
}

// ─── Send Bulk Price Drop Alerts ─────────────────────────────────────────────

interface BulkPriceDropData {
  recipients: Array<{
    phone: string
    name?: string
  }>
  carTitle: string
  oldPrice: string
  newPrice: string
  carUrl: string
  onProgress?: (sent: number, total: number) => void
}

export async function sendBulkPriceDropAlerts(
  data: BulkPriceDropData
): Promise<BulkWhatsAppResult> {
  const result: BulkWhatsAppResult = {
    total: data.recipients.length,
    sent: 0,
    failed: 0,
    errors: [],
  }

  for (const recipient of data.recipients) {
    try {
      const sendResult = await sendPriceDropAlert(recipient.phone, {
        recipientName: recipient.name || "Customer",
        carTitle: data.carTitle,
        oldPrice: data.oldPrice,
        newPrice: data.newPrice,
        carUrl: data.carUrl,
      })

      if (sendResult.success) {
        result.sent++
      } else {
        result.failed++
        result.errors.push({
          phone: recipient.phone,
          error: sendResult.error || "Unknown error",
        })
      }
    } catch (error) {
      result.failed++
      result.errors.push({
        phone: recipient.phone,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }

    data.onProgress?.(result.sent + result.failed, result.total)

    // Rate limit between sends
    await new Promise((r) => setTimeout(r, 1000 / RATE_LIMIT.maxPerSecond))
  }

  return result
}

// ─── Send Bulk Raw Messages ──────────────────────────────────────────────────

interface BulkRawWhatsAppData {
  recipients: Array<{
    phone: string
    message: string
    mediaUrl?: string[]
  }>
  onProgress?: (sent: number, total: number) => void
}

export async function sendBulkRawWhatsApp(
  data: BulkRawWhatsAppData
): Promise<BulkWhatsAppResult> {
  const result: BulkWhatsAppResult = {
    total: data.recipients.length,
    sent: 0,
    failed: 0,
    errors: [],
  }

  for (const recipient of data.recipients) {
    try {
      const sendResult = await sendWhatsAppMessage({
        to: recipient.phone,
        message: recipient.message,
        mediaUrl: recipient.mediaUrl,
      })

      if (sendResult.success) {
        result.sent++
      } else {
        result.failed++
        result.errors.push({
          phone: recipient.phone,
          error: sendResult.error || "Unknown error",
        })
      }
    } catch (error) {
      result.failed++
      result.errors.push({
        phone: recipient.phone,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }

    data.onProgress?.(result.sent + result.failed, result.total)

    await new Promise((r) => setTimeout(r, 1000 / RATE_LIMIT.maxPerSecond))
  }

  return result
}

// ─── WhatsApp Click-to-Chat URL Generator ────────────────────────────────────

export function generateWhatsAppClickToChatUrl(
  phoneNumber: string,
  message?: string
): string {
  const phone = phoneNumber.replace(/[^0-9]/g, "")
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : ""
  return `https://wa.me/${phone}${encodedMessage}`
}

// ─── WhatsApp QR Code URL ────────────────────────────────────────────────────

export function generateWhatsAppQRUrl(
  phoneNumber: string,
  message?: string
): string {
  const url = generateWhatsAppClickToChatUrl(phoneNumber, message)
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`
}
