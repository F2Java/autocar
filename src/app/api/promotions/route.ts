import { NextRequest, NextResponse } from "next/server"
import { sendBulkPromotions, sendBulkRawEmails } from "@/lib/email-bulk"
import { addToQueue, getQueueStatus } from "@/lib/email-bulk"
import { sendBulkWhatsAppPromotions } from "@/lib/whatsapp-bulk"

// POST /api/promotions - Create and send a promotional campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      channel, // "whatsapp", "email", "both"
      subject,
      headline,
      messageTemplate,
      recipients,
      carIds,
      carTitle,
      carPrice,
      carImage,
      scheduledAt,
      ctaText,
      ctaUrl,
    } = body

    if (!name || !channel || !recipients?.length) {
      return NextResponse.json(
        { error: "Missing required fields: name, channel, recipients" },
        { status: 400 }
      )
    }

    if (channel === "email" || channel === "both") {
      if (!subject || !messageTemplate) {
        return NextResponse.json(
          { error: "subject and messageTemplate are required for email campaigns" },
          { status: 400 }
        )
      }
    }

    // Create campaign record
    const campaign = {
      id: `camp_${Date.now()}`,
      name,
      channel,
      subject,
      headline: headline || name,
      messageTemplate,
      status: scheduledAt ? "SCHEDULED" : "SENDING",
      scheduledAt,
      totalSent: 0,
      totalFailed: 0,
      createdAt: new Date().toISOString(),
    }

    // If scheduled, queue for later
    if (scheduledAt) {
      const jobId = addToQueue("promotion", {
        campaignId: campaign.id,
        ...body,
      })
      return NextResponse.json({
        data: { ...campaign, jobId },
        message: `Campaign scheduled for ${scheduledAt}`,
      })
    }

    // Send immediately
    const results = {
      whatsapp: { sent: 0, failed: 0 },
      email: { sent: 0, failed: 0 },
    }

    // Send WhatsApp messages via Twilio
    if (channel === "whatsapp" || channel === "both") {
      const whatsappRecipients = recipients.filter((r: any) => r.phone)

      if (whatsappRecipients.length > 0) {
        const whatsappResult = await sendBulkWhatsAppPromotions({
          recipients: whatsappRecipients.map((r: any) => ({
            phone: r.phone,
            name: r.name,
          })),
          headline: headline || name,
          body: messageTemplate || "",
          carTitle,
          carPrice,
          ctaUrl,
        })

        results.whatsapp.sent = whatsappResult.sent
        results.whatsapp.failed = whatsappResult.failed

        if (whatsappResult.errors.length > 0) {
          console.error("WhatsApp send errors:", whatsappResult.errors)
        }
      }
    }

    // Send emails via Resend
    if (channel === "email" || channel === "both") {
      const emailRecipients = recipients.filter((r: any) => r.email)

      if (emailRecipients.length > 0) {
        const emailResult = await sendBulkPromotions({
          recipients: emailRecipients.map((r: any) => ({
            email: r.email,
            name: r.name,
          })),
          subject: subject || name,
          headline: headline || name,
          body: messageTemplate || "",
          carTitle,
          carPrice,
          carImage,
          ctaText,
          ctaUrl,
        })

        results.email.sent = emailResult.sent
        results.email.failed = emailResult.failed

        if (emailResult.errors.length > 0) {
          console.error("Email send errors:", emailResult.errors)
        }
      }
    }

    campaign.totalSent = results.whatsapp.sent + results.email.sent
    campaign.totalFailed = results.whatsapp.failed + results.email.failed
    campaign.status = "SENT"

    return NextResponse.json({
      data: campaign,
      results,
      message: `Campaign sent: ${campaign.totalSent} successful, ${campaign.totalFailed} failed`,
    })
  } catch (error) {
    console.error("Promotion error:", error)
    return NextResponse.json(
      { error: "Failed to process campaign" },
      { status: 500 }
    )
  }
}

// GET /api/promotions - List all campaigns
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const channel = searchParams.get("channel")

  // Mock data - in production, query database
  const campaigns = [
    {
      id: "1",
      name: "New Year Car Sale",
      channel: "BOTH",
      status: "SENT",
      subject: "New Year, New Car! Special Deals Inside",
      totalSent: 1250,
      totalOpened: 890,
      totalClicked: 234,
      totalFailed: 12,
      createdAt: "2024-01-01T00:00:00Z",
      sentAt: "2024-01-01T01:00:00Z",
    },
    {
      id: "2",
      name: "Electric Vehicle Promotion",
      channel: "EMAIL",
      status: "SENT",
      subject: "Go Electric! Tesla & EV Deals",
      totalSent: 500,
      totalOpened: 320,
      totalClicked: 89,
      totalFailed: 5,
      createdAt: "2024-01-15T00:00:00Z",
      sentAt: "2024-01-15T02:00:00Z",
    },
  ]

  let filtered = campaigns
  if (status) filtered = filtered.filter((c) => c.status === status)
  if (channel) filtered = filtered.filter((c) => c.channel === channel)

  const queueStatus = getQueueStatus()

  return NextResponse.json({
    data: filtered,
    queue: queueStatus,
  })
}
