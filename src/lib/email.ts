import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.EMAIL_FROM || "AutoCar <noreply@autocar.id>"
const FROM_NAME = "AutoCar"

// ─── Base Email Sender ───────────────────────────────────────────────────────

interface SendEmailOptions {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  replyTo?: string
  tags?: Array<{ name: string; value: string }>
}

export async function sendEmail(options: SendEmailOptions) {
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html || "",
      text: options.text || "",
      replyTo: options.replyTo || undefined,
      tags: options.tags || undefined,
    } as any)

    return { success: true, id: result.data?.id, error: null }
  } catch (error) {
    console.error("Email send error:", error)
    return {
      success: false,
      id: null,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// ─── Car Inquiry Notification ────────────────────────────────────────────────

interface InquiryEmailData {
  sellerEmail: string
  sellerName: string
  buyerName: string
  buyerEmail: string
  buyerPhone?: string
  carTitle: string
  carPrice: string
  message?: string
  preferredContact: string
}

export async function sendInquiryNotification(data: InquiryEmailData) {
  const subject = `New Inquiry: ${data.carTitle}`
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <div style="background:linear-gradient(135deg,#1e293b,#334155);border-radius:16px;padding:32px;border:1px solid rgba(59,130,246,0.2);">
          <!-- Header -->
          <div style="text-align:center;margin-bottom:24px;">
            <h1 style="color:#3b82f6;font-size:24px;margin:0;letter-spacing:2px;">AUTO<span style="color:#06b6d4;">CAR</span></h1>
            <p style="color:#94a3b8;font-size:12px;margin-top:4px;">New Inquiry Notification</p>
          </div>

          <!-- Car Info -->
          <div style="background:rgba(59,130,246,0.1);border-radius:12px;padding:20px;margin-bottom:20px;border:1px solid rgba(59,130,246,0.2);">
            <h2 style="color:#f1f5f9;font-size:18px;margin:0 0 8px 0;">${data.carTitle}</h2>
            <p style="color:#3b82f6;font-size:24px;font-weight:bold;margin:0;">${data.carPrice}</p>
          </div>

          <!-- Buyer Info -->
          <div style="margin-bottom:20px;">
            <h3 style="color:#e2e8f0;font-size:14px;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px 0;">Buyer Information</h3>
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:8px 0;color:#94a3b8;font-size:14px;">Name</td>
                <td style="padding:8px 0;color:#f1f5f9;font-size:14px;text-align:right;">${data.buyerName}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#94a3b8;font-size:14px;">Email</td>
                <td style="padding:8px 0;color:#f1f5f9;font-size:14px;text-align:right;">${data.buyerEmail}</td>
              </tr>
              ${data.buyerPhone ? `
              <tr>
                <td style="padding:8px 0;color:#94a3b8;font-size:14px;">Phone</td>
                <td style="padding:8px 0;color:#f1f5f9;font-size:14px;text-align:right;">${data.buyerPhone}</td>
              </tr>
              ` : ""}
              <tr>
                <td style="padding:8px 0;color:#94a3b8;font-size:14px;">Preferred Contact</td>
                <td style="padding:8px 0;color:#f1f5f9;font-size:14px;text-align:right;">${data.preferredContact}</td>
              </tr>
            </table>
          </div>

          ${data.message ? `
          <!-- Message -->
          <div style="background:rgba(30,41,59,0.5);border-radius:12px;padding:16px;margin-bottom:20px;border:1px solid #334155;">
            <p style="color:#94a3b8;font-size:12px;margin:0 0 8px 0;text-transform:uppercase;letter-spacing:1px;">Message</p>
            <p style="color:#e2e8f0;font-size:14px;margin:0;line-height:1.6;">${data.message}</p>
          </div>
          ` : ""}

          <!-- CTA -->
          <div style="text-align:center;margin-top:24px;">
            <a href="mailto:${data.buyerEmail}?subject=Re: ${encodeURIComponent(data.carTitle)}" style="display:inline-block;background:#3b82f6;color:#ffffff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;">Reply to Buyer</a>
          </div>

          <!-- Footer -->
          <div style="text-align:center;margin-top:32px;padding-top:20px;border-top:1px solid #334155;">
            <p style="color:#64748b;font-size:12px;margin:0;">This inquiry was sent via AutoCar marketplace</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: data.sellerEmail,
    subject,
    html,
    replyTo: data.buyerEmail,
    tags: [{ name: "category", value: "inquiry" }],
  })
}

// ─── Car Promotion Email ─────────────────────────────────────────────────────

interface PromotionEmailData {
  recipientEmail: string
  recipientName: string
  subject: string
  headline: string
  body: string
  carTitle?: string
  carPrice?: string
  carImage?: string
  ctaText?: string
  ctaUrl?: string
}

export async function sendPromotionEmail(data: PromotionEmailData) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <div style="background:linear-gradient(135deg,#1e293b,#334155);border-radius:16px;padding:32px;border:1px solid rgba(59,130,246,0.2);">
          <!-- Header -->
          <div style="text-align:center;margin-bottom:24px;">
            <h1 style="color:#3b82f6;font-size:24px;margin:0;letter-spacing:2px;">AUTO<span style="color:#06b6d4;">CAR</span></h1>
          </div>

          <!-- Headline -->
          <h2 style="color:#f1f5f9;font-size:28px;text-align:center;margin:0 0 8px 0;line-height:1.3;">${data.headline}</h2>
          <p style="color:#94a3b8;font-size:14px;text-align:center;margin:0 0 24px 0;">Hi ${data.recipientName},</p>

          <!-- Car Card -->
          ${data.carTitle ? `
          <div style="background:rgba(59,130,246,0.1);border-radius:12px;overflow:hidden;margin-bottom:24px;border:1px solid rgba(59,130,246,0.2);">
            ${data.carImage ? `<img src="${data.carImage}" alt="${data.carTitle}" style="width:100%;height:200px;object-fit:cover;" />` : ""}
            <div style="padding:20px;">
              <h3 style="color:#f1f5f9;font-size:18px;margin:0 0 8px 0;">${data.carTitle}</h3>
              ${data.carPrice ? `<p style="color:#3b82f6;font-size:24px;font-weight:bold;margin:0;">${data.carPrice}</p>` : ""}
            </div>
          </div>
          ` : ""}

          <!-- Body -->
          <div style="color:#cbd5e1;font-size:14px;line-height:1.8;margin-bottom:24px;">
            ${data.body.replace(/\n/g, "<br>")}
          </div>

          <!-- CTA -->
          ${data.ctaUrl ? `
          <div style="text-align:center;margin:32px 0;">
            <a href="${data.ctaUrl}" style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#06b6d4);color:#ffffff;padding:14px 40px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">${data.ctaText || "View Now"}</a>
          </div>
          ` : ""}

          <!-- Footer -->
          <div style="text-align:center;margin-top:32px;padding-top:20px;border-top:1px solid #334155;">
            <p style="color:#64748b;font-size:12px;margin:0 0 8px 0;">You received this because you subscribed to AutoCar updates.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://autocar.id"}/unsubscribe?email=${encodeURIComponent(data.recipientEmail)}" style="color:#64748b;font-size:12px;">Unsubscribe</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: data.recipientEmail,
    subject: data.subject,
    html,
    tags: [{ name: "category", value: "promotion" }],
  })
}

// ─── Welcome Email ───────────────────────────────────────────────────────────

interface WelcomeEmailData {
  email: string
  name: string
}

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <div style="background:linear-gradient(135deg,#1e293b,#334155);border-radius:16px;padding:32px;border:1px solid rgba(59,130,246,0.2);">
          <div style="text-align:center;margin-bottom:24px;">
            <h1 style="color:#3b82f6;font-size:24px;margin:0;letter-spacing:2px;">AUTO<span style="color:#06b6d4;">CAR</span></h1>
          </div>

          <h2 style="color:#f1f5f9;font-size:22px;text-align:center;margin:0 0 16px 0;">Welcome to AutoCar! 🚗</h2>
          <p style="color:#94a3b8;font-size:14px;text-align:center;margin:0 0 24px 0;">Hi ${data.name}, thanks for joining Indonesia's leading automotive marketplace.</p>

          <div style="color:#cbd5e1;font-size:14px;line-height:1.8;margin-bottom:24px;">
            <p>Here's what you can do:</p>
            <ul style="padding-left:20px;">
              <li style="margin-bottom:8px;"><strong style="color:#f1f5f9;">Browse Cars</strong> — Search thousands of new and used cars with video tours</li>
              <li style="margin-bottom:8px;"><strong style="color:#f1f5f9;">Sell Your Car</strong> — List your car with video and reach thousands of buyers</li>
              <li style="margin-bottom:8px;"><strong style="color:#f1f5f9;">Get Promotions</strong> — Receive exclusive deals via email and WhatsApp</li>
            </ul>
          </div>

          <div style="text-align:center;margin:32px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://autocar.id"}/cars" style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#06b6d4);color:#ffffff;padding:14px 40px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">Start Browsing</a>
          </div>

          <div style="text-align:center;margin-top:32px;padding-top:20px;border-top:1px solid #334155;">
            <p style="color:#64748b;font-size:12px;margin:0;">Questions? Reply to this email or chat with us on WhatsApp.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: data.email,
    subject: "Welcome to AutoCar! 🚗",
    html,
    tags: [{ name: "category", value: "welcome" }],
  })
}
