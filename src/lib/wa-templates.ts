const PHONE = "6281313717101"

export const waTemplates = {
  // General inquiry
  general: () =>
    `Halo Pasar Mobil Bekas! 👋\nSaya ingin bertanya tentang mobil yang dijual.\n\nBisa bantu saya?`,

  // Car inquiry from detail page
  carInquiry: (carTitle: string, price: string) =>
    `Halo! 👋\nSaya tertarik dengan:\n\n🚗 *${carTitle}*\n💰 Harga: ${price}\n\nBisa info lebih lanjut? Terima kasih!`,

  // Car inquiry from WhatsApp float
  carInquiryFloat: (carTitle: string) =>
    `Halo! 👋\nSaya melihat listing *${carTitle}* di Pasar Mobil Bekas.\n\nBisa info detail dan harga?`,

  // Sell car inquiry
  sellCar: (carDetails: string) =>
    `Halo! 👋\nSaya ingin menjual mobil:\n\n🚗 *${carDetails}*\n\nBisa bantu proses listing?`,

  // Dealer contact
  dealerContact: (dealerName: string) =>
    `Halo! 👋\nSaya ingin menghubungi dealer *${dealerName}* dari Pasar Mobil Bekas.\n\nBisa info ketersediaan mobil?`,

  // Estimate request
  estimate: (preferences: string) =>
    `Halo! 👋\nSaya ingin minta penawaran:\n\n${preferences}\n\nBisa info harga dan ketersediaan?`,

  // Test drive booking
  testDrive: (carTitle: string, preferredDate: string) =>
    `Halo! 👋\nSaya ingin test drive:\n\n🚗 *${carTitle}*\n📅 Tanggal preferensi: ${preferredDate}\n\nApakah bisa dijadwalkan?`,

  // Financing inquiry
  financing: (carTitle: string, budget: string) =>
    `Halo! 👋\nSaya tertarik dengan *${carTitle}* dan ingin tahu opsi kredit:\n\n💰 Budget: ${budget}\n\nBisa info cicilan dan DP?`,

  // Complaint / feedback
  feedback: () =>
    `Halo Pasar Mobil Bekas! 👋\n\nSaya ingin memberikan feedback:\n\n`,

  // Help / support
  help: () =>
    `Halo Pasar Mobil Bekas! 👋\n\nSaya butuh bantuan:\n\n`,
}

export function getWaUrl(template: string, ...args: string[]): string {
  const templateFn = waTemplates[template as keyof typeof waTemplates]
  if (!templateFn) return `https://wa.me/${PHONE}?text=${encodeURIComponent(waTemplates.general())}`
  const message = (templateFn as (...a: string[]) => string)(...args)
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`
}

export function getDirectWaUrl(message?: string): string {
  const msg = message || waTemplates.general()
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`
}
