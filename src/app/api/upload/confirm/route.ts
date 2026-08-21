import { NextRequest, NextResponse } from "next/server"
import { fileExists } from "@/lib/s3"

// POST /api/upload/confirm - Confirm upload and save metadata
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, carId, type, alt, caption, isPrimary } = body

    if (!key) {
      return NextResponse.json(
        { error: "key is required" },
        { status: 400 }
      )
    }

    // Verify file exists in S3
    const exists = await fileExists(key)
    if (!exists) {
      return NextResponse.json(
        { error: "File not found in S3" },
        { status: 404 }
      )
    }

    // Generate public URL
    const publicUrl = `${process.env.S3_PUBLIC_URL || `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com`}/${key}`

    // In production: save to database
    // For images: save to car_images table
    // For videos: save to car_videos table
    const metadata = {
      id: Date.now().toString(),
      carId: carId || null,
      url: publicUrl,
      key,
      type,
      alt: alt || null,
      caption: caption || null,
      isPrimary: isPrimary || false,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      data: metadata,
      message: "Upload confirmed successfully",
    })
  } catch (error) {
    console.error("Confirm upload error:", error)
    return NextResponse.json(
      { error: "Failed to confirm upload" },
      { status: 500 }
    )
  }
}

// DELETE /api/upload/confirm - Delete uploaded file
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get("key")

    if (!key) {
      return NextResponse.json(
        { error: "key is required" },
        { status: 400 }
      )
    }

    // In production: delete from S3 and database
    // await deleteFromS3(key)
    // await db.carImage.deleteMany({ where: { key } })

    return NextResponse.json({ message: "File deleted successfully" })
  } catch (error) {
    console.error("Delete upload error:", error)
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    )
  }
}
