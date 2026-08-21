import type { Metadata } from "next"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { WhatsAppFloat } from "@/components/ui/whatsapp-float"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "AutoCar — Buy & Sell New and Used Cars",
    template: "%s | AutoCar",
  },
  description:
    "Indonesia's leading automotive marketplace. Browse thousands of new and used cars with video listings, verified sellers, and secure transactions.",
  keywords: [
    "buy car",
    "sell car",
    "used car",
    "new car",
    "automotive",
    "car marketplace",
    "Indonesia",
    "mobil bekas",
    "mobil baru",
  ],
  openGraph: {
    title: "AutoCar — Buy & Sell New and Used Cars",
    description:
      "Indonesia's leading automotive marketplace with video listings.",
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
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased font-body">
        <Navbar />
        <main className="pt-16 lg:pt-20">{children}</main>
        <Footer />
        <WhatsAppFloat
          phoneNumber="6281234567890"
          businessName="AutoCar"
          message="Hi! I'm interested in buying a car. Can you help me?"
        />
      </body>
    </html>
  )
}
