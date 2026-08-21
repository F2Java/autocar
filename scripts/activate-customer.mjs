import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
})

async function main() {
  const email = process.argv[2] || "makmur@test.com"
  const customer = await prisma.b2BCustomer.update({
    where: { email },
    data: { status: "ACTIVE" },
  })
  console.log("✅ Activated:", customer.companyName, "-", customer.email, "- Status:", customer.status)
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error("Error:", e.message)
  process.exit(1)
})
