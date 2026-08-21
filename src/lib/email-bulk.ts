import { sendPromotionEmail, sendEmail } from "./email"

// ─── Rate Limiting ───────────────────────────────────────────────────────────

// Resend free tier: 100 emails/day, 3000/month
// Paid tier: 50,000/month with higher rate limits
const RATE_LIMIT = {
  maxPerSecond: 2, // Conservative for free tier
  maxPerDay: 100,
  retryDelay: 1000,
  maxRetries: 3,
}

// Simple in-memory rate limiter
class RateLimiter {
  private queue: Array<() => Promise<void>> = []
  private processing = false
  private sentCount = 0
  private lastReset = Date.now()

  async add(fn: () => Promise<void>) {
    this.queue.push(fn)
    if (!this.processing) {
      this.processQueue()
    }
  }

  private async processQueue() {
    this.processing = true

    // Reset daily count
    if (Date.now() - this.lastReset > 24 * 60 * 60 * 1000) {
      this.sentCount = 0
      this.lastReset = Date.now()
    }

    while (this.queue.length > 0) {
      if (this.sentCount >= RATE_LIMIT.maxPerDay) {
        console.warn(`Daily limit reached (${RATE_LIMIT.maxPerDay}). Queuing remaining.`)
        break
      }

      const fn = this.queue.shift()
      if (fn) {
        await fn()
        this.sentCount++
        // Rate limit: wait between sends
        await new Promise((r) => setTimeout(r, 1000 / RATE_LIMIT.maxPerSecond))
      }
    }

    this.processing = false
  }

  getCount() {
    return this.sentCount
  }
}

const rateLimiter = new RateLimiter()

// ─── Bulk Send Result ────────────────────────────────────────────────────────

export interface BulkSendResult {
  total: number
  sent: number
  failed: number
  errors: Array<{ email: string; error: string }>
}

// ─── Send Bulk Promotion Emails ──────────────────────────────────────────────

interface BulkPromotionData {
  recipients: Array<{
    email: string
    name?: string
  }>
  subject: string
  headline: string
  body: string
  carTitle?: string
  carPrice?: string
  carImage?: string
  ctaText?: string
  ctaUrl?: string
  onProgress?: (sent: number, total: number) => void
}

export async function sendBulkPromotions(
  data: BulkPromotionData
): Promise<BulkSendResult> {
  const result: BulkSendResult = {
    total: data.recipients.length,
    sent: 0,
    failed: 0,
    errors: [],
  }

  // Process in batches of 10
  const batchSize = 10
  const batches = []
  for (let i = 0; i < data.recipients.length; i += batchSize) {
    batches.push(data.recipients.slice(i, i + batchSize))
  }

  for (const batch of batches) {
    const promises = batch.map(async (recipient) => {
      try {
        const sendResult = await sendPromotionEmail({
          recipientEmail: recipient.email,
          recipientName: recipient.name || "Customer",
          subject: data.subject,
          headline: data.headline,
          body: data.body,
          carTitle: data.carTitle,
          carPrice: data.carPrice,
          carImage: data.carImage,
          ctaText: data.ctaText,
          ctaUrl: data.ctaUrl,
        })

        if (sendResult.success) {
          result.sent++
        } else {
          result.failed++
          result.errors.push({
            email: recipient.email,
            error: sendResult.error || "Unknown error",
          })
        }
      } catch (error) {
        result.failed++
        result.errors.push({
          email: recipient.email,
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

// ─── Send Bulk Raw Emails ────────────────────────────────────────────────────

interface BulkRawEmailData {
  recipients: Array<{
    email: string
    subject: string
    html: string
    text?: string
  }>
  onProgress?: (sent: number, total: number) => void
}

export async function sendBulkRawEmails(
  data: BulkRawEmailData
): Promise<BulkSendResult> {
  const result: BulkSendResult = {
    total: data.recipients.length,
    sent: 0,
    failed: 0,
    errors: [],
  }

  for (const recipient of data.recipients) {
    try {
      const sendResult = await sendEmail({
        to: recipient.email,
        subject: recipient.subject,
        html: recipient.html,
        text: recipient.text,
        tags: [{ name: "category", value: "bulk" }],
      })

      if (sendResult.success) {
        result.sent++
      } else {
        result.failed++
        result.errors.push({
          email: recipient.email,
          error: sendResult.error || "Unknown error",
        })
      }
    } catch (error) {
      result.failed++
      result.errors.push({
        email: recipient.email,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }

    data.onProgress?.(result.sent + result.failed, result.total)

    // Rate limit: 100ms between sends
    await new Promise((r) => setTimeout(r, 100))
  }

  return result
}

// ─── Email Queue (for background processing) ─────────────────────────────────

interface QueueJob {
  id: string
  type: "promotion" | "inquiry" | "welcome"
  data: any
  status: "pending" | "processing" | "completed" | "failed"
  attempts: number
  maxAttempts: number
  createdAt: Date
  processedAt?: Date
  error?: string
}

// In-memory queue (in production, use Bull/BullMQ or similar)
const emailQueue: QueueJob[] = []

export function addToQueue(
  type: QueueJob["type"],
  data: any,
  maxAttempts = 3
): string {
  const job: QueueJob = {
    id: `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type,
    data,
    status: "pending",
    attempts: 0,
    maxAttempts,
    createdAt: new Date(),
  }
  emailQueue.push(job)
  return job.id
}

export function getQueueStatus() {
  return {
    total: emailQueue.length,
    pending: emailQueue.filter((j) => j.status === "pending").length,
    processing: emailQueue.filter((j) => j.status === "processing").length,
    completed: emailQueue.filter((j) => j.status === "completed").length,
    failed: emailQueue.filter((j) => j.status === "failed").length,
  }
}
