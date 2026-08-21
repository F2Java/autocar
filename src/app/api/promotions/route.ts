import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action")

  try {
    if (action === "subscribers") {
      const subscribers = await prisma.contactSubscriber.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      })
      return NextResponse.json({ data: subscribers })
    }

    // Default: return campaigns
    const campaigns = await prisma.promotionCampaign.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        recipients: true,
      },
    })

    const transformed = campaigns.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      channel: c.channel,
      subject: c.subject,
      messageTemplate: c.messageTemplate,
      status: c.status,
      totalSent: c.totalSent,
      totalOpened: c.totalOpened,
      totalClicked: c.totalClicked,
      totalFailed: c.totalFailed,
      scheduledAt: c.scheduledAt?.toISOString() || null,
      sentAt: c.sentAt?.toISOString() || null,
      createdAt: c.createdAt.toISOString(),
    }))

    return NextResponse.json({ data: transformed })
  } catch (error) {
    console.error("Error fetching promotions:", error)
    return NextResponse.json(
      { error: "Failed to fetch promotions" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, channel, subject, messageTemplate, recipientIds } = body

    if (!name || !messageTemplate) {
      return NextResponse.json(
        { error: "Name and message template are required" },
        { status: 400 }
      )
    }

    // Create campaign
    const campaign = await prisma.promotionCampaign.create({
      data: {
        name,
        channel: (channel?.toUpperCase() || "BOTH") as "WHATSAPP" | "EMAIL" | "BOTH",
        subject: subject || null,
        messageTemplate,
        status: "DRAFT",
      },
    })

    // Add recipients if provided
    if (recipientIds && recipientIds.length > 0) {
      await prisma.promotionRecipient.createMany({
        data: recipientIds.map((recipient: { name?: string; email?: string; phone?: string }) => ({
          campaignId: campaign.id,
          name: recipient.name || null,
          email: recipient.email || null,
          phone: recipient.phone || null,
          sent: false,
        })),
      })
    }

    return NextResponse.json(
      { data: campaign, message: "Campaign created successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating campaign:", error)
    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    )
  }
}
