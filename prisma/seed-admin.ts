import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🔧 Seeding admin user...\n")

  const adminEmail = "admin@autocar.id"
  const adminPassword = "admin123"
  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  // Check if admin user already exists
  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (existing) {
    // Update password if user exists
    const updated = await prisma.user.update({
      where: { email: adminEmail },
      data: {
        passwordHash: hashedPassword,
        role: "SUPER_ADMIN",
        isActive: true,
      },
    })
    console.log(`✅ Admin user updated: ${updated.email} (${updated.role})`)
  } else {
    // Create new admin user
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: hashedPassword,
        name: "AutoCar Admin",
        role: "SUPER_ADMIN",
        isActive: true,
      },
    })
    console.log(`✅ Admin user created: ${admin.email} (${admin.role})`)
  }

  // Also create a manager user
  const managerEmail = "manager@autocar.id"
  const managerExisting = await prisma.user.findUnique({
    where: { email: managerEmail },
  })

  if (!managerExisting) {
    const manager = await prisma.user.create({
      data: {
        email: managerEmail,
        passwordHash: hashedPassword,
        name: "AutoCar Manager",
        role: "MANAGER",
        isActive: true,
      },
    })
    console.log(`✅ Manager user created: ${manager.email} (${manager.role})`)
  }

  console.log("\n📋 Admin Login Credentials:")
  console.log("   Admin:   admin@autocar.id / admin123")
  console.log("   Manager: manager@autocar.id / admin123")
  console.log("\n🔒 Change these passwords in production!")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding admin user:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
