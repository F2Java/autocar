import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import twilio from "twilio"

// POST /api/webhooks/whatsapp - Receive Twilio WhatsApp status callbacks
export async function POST(request: NextRequest) {
  try {
    // Parse form data (Twilio sends application/x-www-form-urlencoded)
    const formData = await request.formData()
    const body = Object.fromEntries(formData.entries())

    const {
      MessageSid,
      MessageStatus,
      To,
      From,
      ErrorCode,
      ErrorMessage,
      NumMedia,
      NumSegments,
      Price,
      PriceUnit,
    } = body as Record<string, string>

    console.log(`WhatsApp webhook: ${MessageStatus}`, {
      sid: MessageSid,
      to: To,
      from: From,
      status: MessageStatus,
      error: ErrorCode ? `${ErrorCode}: ${ErrorMessage}` : null,
      price: Price ? `${Price} ${PriceUnit}` : null,
    })

    // Process different status types
    switch (MessageStatus) {
      case "queued":
        await handleQueued(MessageSid, To, From)
        break

      case "sent":
        await handleSent(MessageSid, To, From)
        break

      case "delivered":
        await handleDelivered(MessageSid, To, From)
        break

      case "read":
        await handleRead(MessageSid, To, From)
        break

      case "failed":
        await handleFailed(MessageSid, To, From, ErrorCode, ErrorMessage)
        break

      case "undelivered":
        await handleUndelivered(MessageSid, To, From, ErrorCode, ErrorMessage)
        break

      default:
        console.log(`Unhandled WhatsApp status: ${MessageStatus}`)
    }

    // Return 200 OK to Twilio
    return new NextResponse(null, { status: 200 })
  } catch (error) {
    console.error("WhatsApp webhook error:", error)
    return new NextResponse(null, { status: 200 }) // Always return 200 to Twilio
  }
}

// GET /api/webhooks/whatsapp - Verify webhook endpoint
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "WhatsApp webhook endpoint is active",
  })
}

// ─── Event Handlers ──────────────────────────────────────────────────────────

async function handleQueued(sid: string, to: string, from: string) {
  // In production: update whatsapp_logs table status to "queued"
  console.log("WhatsApp queued:", sid)
}

async function handleSent(sid: string, to: string, from: string) {
  // In production: update whatsapp_logs table status to "sent"
  console.log("WhatsApp sent:", sid)
}

async function handleDelivered(sid: string, to: string, from: string) {
  // In production: update whatsapp_logs table status to "delivered"
  console.log("WhatsApp delivered:", sid)
}

async function handleRead(sid: string, to: string, from: string) {
  // In production: update whatsapp_logs table status to "read"
  console.log("WhatsApp read:", sid)
}

async function handleFailed(
  sid: string,
  to: string,
  from: string,
  errorCode?: string,
  errorMessage?: string
) {
  // In production: update whatsapp_logs table, log error
  console.warn("WhatsApp failed:", sid, errorCode, errorMessage)

  // Common error codes:
  // 30004 - Message blocked (user blocked business)
  // 30005 - Unknown destination handset
  // 30006 - Landline or unreachable handset
  // 30007 - Message blocked (carrier filtering)
  // 30008 - Message failed (expired)
  // 30009 - Resource not found
  // 30010 - Message body too long
}

async function handleUndelivered(
  sid: string,
  to: string,
  from: string,
  errorCode?: string,
  errorMessage?: string
) {
  // In production: update whatsapp_logs table
  console.warn("WhatsApp undelivered:", sid, errorCode, errorMessage)
}
