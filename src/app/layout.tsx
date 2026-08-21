import type { Metadata } from "next"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { WhatsAppFloat } from "@/components/ui/whatsapp-float"
import { Providers } from "@/components/layout/providers"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Pasar Mobil Bekas — Jual Beli Mobil Bekas & Baru",
    template: "%s | Pasar Mobil Bekas",
  },
  description:
    "Pasar mobil bekas dan baru terbesar di Indonesia. Temukan ribuan mobil dengan video tour, penjual terverifikasi, dan transaksi aman.",
  keywords: [
    "jual mobil",
    "beli mobil",
    "mobil bekas",
    "mobil baru",
    "otomotif",
    "pasar mobil",
    "Indonesia",
    "mobil murah",
    "mobil berkualitas",
  ],
  openGraph: {
    title: "Pasar Mobil Bekas — Jual Beli Mobil Bekas & Baru",
    description:
      "Pasar mobil bekas dan baru terbesar di Indonesia dengan video tour.",
    type: "website",
    locale: "id_ID",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="min-h-screen bg-black text-white antialiased font-body">
        <Providers>
          <Navbar />
          <main className="pt-16 lg:pt-20">{children}</main>
          <Footer />
          <WhatsAppFloat
            phoneNumber="6281313717101"
            businessName="Pasar Mobil Bekas"
            message="Halo! Saya tertarik dengan mobil yang dijual. Bisa bantu saya?"
          />
        </Providers>
      </body>
    </html>
  )
}
