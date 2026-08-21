import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "autocar-uploads"
const PUBLIC_URL = process.env.S3_PUBLIC_URL || `https://${BUCKET_NAME}.s3.amazonaws.com`

// File type configurations
export const FILE_CONFIGS = {
  image: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
    allowedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".avif"],
  },
  video: {
    maxSize: 500 * 1024 * 1024, // 500MB
    allowedTypes: ["video/mp4", "video/quicktime", "video/webm", "video/x-msvideo"],
    allowedExtensions: [".mp4", ".mov", ".webm", ".avi"],
  },
} as const

// Generate a unique key for S3
function generateKey(
  type: "image" | "video",
  filename: string,
  carId?: string
): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const ext = filename.split(".").pop()?.toLowerCase() || "jpg"
  const prefix = carId ? `cars/${carId}` : "cars/draft"
  return `${prefix}/${type}/${timestamp}-${random}.${ext}`
}

// Validate file before upload
export function validateFile(
  file: File,
  type: "image" | "video"
): { valid: boolean; error?: string } {
  const config = FILE_CONFIGS[type]

  if (file.size > config.maxSize) {
    const maxMB = config.maxSize / (1024 * 1024)
    return {
      valid: false,
      error: `File too large. Maximum size is ${maxMB}MB.`,
    }
  }

  if (!(config.allowedTypes as readonly string[]).includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${config.allowedExtensions.join(", ")}`,
    }
  }

  return { valid: true }
}

// Generate presigned URL for direct upload
export async function getPresignedUploadUrl(
  filename: string,
  contentType: string,
  type: "image" | "video",
  carId?: string
): Promise<{
  uploadUrl: string
  key: string
  publicUrl: string
}> {
  const key = generateKey(type, filename, carId)

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    // For public read access
    ACL: "public-read",
    // Cache control for CDN
    CacheControl: type === "video" ? "public, max-age=31536000" : "public, max-age=86400",
  })

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600, // 1 hour
  })

  return {
    uploadUrl,
    key,
    publicUrl: `${PUBLIC_URL}/${key}`,
  }
}

// Upload file directly (server-side, for smaller files)
export async function uploadToS3(
  file: Buffer,
  filename: string,
  contentType: string,
  type: "image" | "video",
  carId?: string
): Promise<{ key: string; publicUrl: string }> {
  const key = generateKey(type, filename, carId)

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
    ACL: "public-read",
    CacheControl: type === "video" ? "public, max-age=31536000" : "public, max-age=86400",
  })

  await s3Client.send(command)

  return {
    key,
    publicUrl: `${PUBLIC_URL}/${key}`,
  }
}

// Delete file from S3
export async function deleteFromS3(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })
  await s3Client.send(command)
}

// Check if file exists
export async function fileExists(key: string): Promise<boolean> {
  try {
    const command = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
    await s3Client.send(command)
    return true
  } catch {
    return false
  }
}

// Generate multiple presigned URLs for batch upload
export async function getBatchPresignedUrls(
  files: Array<{ filename: string; contentType: string; type: "image" | "video" }>,
  carId?: string
): Promise<
  Array<{
    uploadUrl: string
    key: string
    publicUrl: string
    filename: string
  }>
> {
  const results = await Promise.all(
    files.map(async (file) => {
      const { uploadUrl, key, publicUrl } = await getPresignedUploadUrl(
        file.filename,
        file.contentType,
        file.type,
        carId
      )
      return { uploadUrl, key, publicUrl, filename: file.filename }
    })
  )
  return results
}
