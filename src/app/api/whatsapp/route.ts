import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { sendWhatsAppMessage, generateClickToChatUrl } from "@/lib/wa-api"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, message, carId, type } = body

    if (!to || !message) {
      return NextResponse.json(
        { error: "Phone number and message are required" },
        { status: 400 }
      )
    }

    // Try to send via WhatsApp Business API
    const result = await sendWhatsAppMessage(to, message)

    // Log the message
    const log = await prisma.whatsAppLog.create({
      data: {
        toNumber: to,
        message,
        status: result.success ? "sent" : "failed",
        errorMessage: result.error || null,
        metadata: carId ? { carId, type } : { type },
      },
    })

    // Always return click-to-chat URL as fallback
    const clickToChatUrl = generateClickToChatUrl(to, message)

    return NextResponse.json({
      success: result.success,
      messageId: result.messageId,
      logId: log.id,
      clickToChatUrl,
      error: result.error,
    })
  } catch (error) {
    console.error("WhatsApp API route error:", error)
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}

// Get WhatsApp message logs
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get("limit") || "50")
  const status = searchParams.get("status")

  try {
    const where = status ? { status } : {}
    
    const logs = await prisma.whatsAppLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    })

    return NextResponse.json({ data: logs })
  } catch (error) {
    console.error("WhatsApp logs error:", error)
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    )
  }
}
