import { NextRequest, NextResponse } from "next/server"

// POST /api/webhooks/email - Receive Resend webhook events
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, created_at, data } = body

    // Log the event
    console.log(`Email webhook: ${type}`, {
      emailId: data?.email_id,
      from: data?.from,
      to: data?.to,
      subject: data?.subject,
      createdAt: created_at,
    })

    // Process different event types
    switch (type) {
      case "email.sent":
        // Email was sent successfully
        await handleEmailSent(data)
        break

      case "email.delivered":
        // Email was delivered to recipient
        await handleEmailDelivered(data)
        break

      case "email.delivery_delayed":
        // Email delivery was delayed
        await handleEmailDelayed(data)
        break

      case "email.complained":
        // Recipient marked as spam
        await handleEmailComplained(data)
        break

      case "email.bounced":
        // Email bounced
        await handleEmailBounced(data)
        break

      case "email.opened":
        // Recipient opened the email
        await handleEmailOpened(data)
        break

      case "email.clicked":
        // Recipient clicked a link
        await handleEmailClicked(data)
        break

      default:
        console.log(`Unhandled email event: ${type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}

// GET /api/webhooks/email - Verify webhook endpoint
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Email webhook endpoint is active",
  })
}

// ─── Event Handlers ──────────────────────────────────────────────────────────

async function handleEmailSent(data: any) {
  // In production: update email_logs table status to "sent"
  console.log("Email sent:", data?.email_id)
}

async function handleEmailDelivered(data: any) {
  // In production: update email_logs table status to "delivered"
  console.log("Email delivered:", data?.email_id)
}

async function handleEmailDelayed(data: any) {
  // In production: log delay, maybe alert
  console.log("Email delayed:", data?.email_id)
}

async function handleEmailComplained(data: any) {
  // In production: mark recipient as complained, remove from future lists
  console.warn("Email complained (spam):", data?.to)
}

async function handleEmailBounced(data: any) {
  // In production: mark email as invalid, remove from future lists
  console.warn("Email bounced:", data?.to)
}

async function handleEmailOpened(data: any) {
  // In production: update email_logs, increment open count
  console.log("Email opened:", data?.email_id)
}

async function handleEmailClicked(data: any) {
  // In production: update email_logs, increment click count
  console.log("Email clicked:", data?.email_id, data?.click?.url)
}
