import { NextRequest, NextResponse } from "next/server"
import { getPresignedUploadUrl, getBatchPresignedUrls, validateFile, FILE_CONFIGS } from "@/lib/s3"

// POST /api/upload/presign - Get presigned URL for direct S3 upload
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { filename, contentType, type, carId, files } = body

    // Batch upload mode
    if (files && Array.isArray(files)) {
      if (files.length > 10) {
        return NextResponse.json(
          { error: "Maximum 10 files per batch" },
          { status: 400 }
        )
      }

      const results = await getBatchPresignedUrls(
        files.map((f: any) => ({
          filename: f.filename,
          contentType: f.contentType,
          type: f.type as "image" | "video",
        })),
        carId
      )

      return NextResponse.json({ data: results })
    }

    // Single upload mode
    if (!filename || !contentType || !type) {
      return NextResponse.json(
        { error: "filename, contentType, and type are required" },
        { status: 400 }
      )
    }

    if (type !== "image" && type !== "video") {
      return NextResponse.json(
        { error: "type must be 'image' or 'video'" },
        { status: 400 }
      )
    }

    // Validate file type
    const config = FILE_CONFIGS[type as "image" | "video"]
    const ext = filename.split(".").pop()?.toLowerCase()
    if (!(config.allowedExtensions as readonly string[]).includes(`.${ext}`)) {
      return NextResponse.json(
        {
          error: `Invalid file extension. Allowed: ${config.allowedExtensions.join(", ")}`,
        },
        { status: 400 }
      )
    }

    const { uploadUrl, key, publicUrl } = await getPresignedUploadUrl(
      filename,
      contentType,
      type,
      carId
    )

    return NextResponse.json({
      data: {
        uploadUrl,
        key,
        publicUrl,
        expiresInSeconds: 3600,
      },
    })
  } catch (error) {
    console.error("Presign error:", error)
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    )
  }
}
