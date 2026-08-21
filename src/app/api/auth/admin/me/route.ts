import { NextResponse } from "next/server"
import { getAdminFromCookies } from "@/lib/admin-auth"

export async function GET() {
  const user = await getAdminFromCookies()

  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    )
  }

  return NextResponse.json({ data: user })
}
